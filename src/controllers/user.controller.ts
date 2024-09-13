import { Request, Response, NextFunction } from "express-serve-static-core";
import {
	UserTypes,
	RegistrationData,
	ActivationRequest,
	LoginRequest,
	ActivationPayload,
	SocialAuthBody,
	UpdateUserInfo,
	UpdatePassword,
	UpdateProfilePicture,
	NewUser,
} from "../utils/types";
import ErrorHandler from "../utils/errorHandler";
import { CatchAsyncError } from "../middleware/asyncError";
import User from "../schemas/user.schema";
import {
	accessTokenOptions,
	createActivationToken,
	refreshTokenOptions,
} from "../utils/tokens";
import mailSender from "../utils/mailSender";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { sendToken } from "../utils/tokens";
import { redis } from "../utils/redis";
import "dotenv/config";
import { getUserById } from "../services/user.service";
import cloudinary from "cloudinary";

// sign-up user
export const userRegistration = CatchAsyncError(
	async (
		request: Request<{}, {}, RegistrationData>,
		response: Response,
		next: NextFunction
	) => {
		try {
			const { name, email, password } = request.body;

			const isEmailExist = await User.findOne({ email });
			if (isEmailExist) {
				return next(new ErrorHandler("Email already exist", 400));
			}

			const user = { name, email, password };

			const activationToken = createActivationToken(user);

			const activationCode = activationToken.activationCode;

			const data = { user: { name: user.name }, activationCode };

			try {
				await mailSender({
					email: user.email,
					subject: "Learnaray - Let's complete your account setup",
					template: "activation-mail.ejs",
					data,
				});

				response.status(201).send({
					success: true,
					message: `Please check your email: ${email} to activate your account`,
					activationToken: activationToken.token,
				});
			} catch (error: any) {
				return next(new ErrorHandler(error.message, 400));
			}
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

// Activate user

export const activateUser = CatchAsyncError(
	async (
		request: Request<{}, {}, ActivationRequest>,
		response: Response,
		next: NextFunction
	) => {
		try {
			const { userActivationToken, userActivationCode } = request.body;

			const newUser: NewUser = jwt.verify(
				userActivationToken,
				process.env.JWT_ACTIVATION_SECRET as string
			) as ActivationPayload;

			if (newUser.activationCode !== userActivationCode) {
				return next(new ErrorHandler("Invalid activation code", 400));
			}

			const { name, email, password } = newUser.user;

			const existUser = await User.findOne({ email });

			if (existUser) {
				return next(new ErrorHandler("Email exist already", 409));
			}
			await User.create({
				name,
				email,
				password,
			});

			// Send a welcome email to welcome our new user
			const data = { name: name };
			await mailSender({
				email: email,
				subject: "Welcome to Learnaray",
				template: "welcome-mail.ejs",
				data,
			});

			response.status(201).send({
				success: true,
				message: "User activated successfully",
			});
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

export const userLogin = CatchAsyncError(
	async (
		request: Request<{}, {}, LoginRequest>,
		response: Response,
		next: NextFunction
	) => {
		try {
			const { email, password } = request.body;

			if (!email || !password) {
				return next(
					new ErrorHandler(
						"Please enter your email and password",
						400
					)
				);
			}

			const user = await User.findOne({ email }).select("+password");

			if (!user) {
				return next(new ErrorHandler("Invalid email or password", 400));
			}

			const isPasswordMatch = await user.comparePassword(password);

			if (!isPasswordMatch) {
				return next(new ErrorHandler("Invalid email or password", 400));
			}
			sendToken(user, 200, response);
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

export const userLogout = CatchAsyncError(
	async (request: Request, response: Response, next: NextFunction) => {
		try {
			response.cookie("userAccessToken", "", { maxAge: 1 });
			response.cookie("userRefreshToken", "", { maxAge: 1 });
			const userId = request.user?._id || "";
			redis.del(userId as string);
			response.status(200).send({
				success: true,
				message: "You've logged out successfully",
			});
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

// update access token

export const updateAccessToken = CatchAsyncError(
	async (
		request: Request<{}, {}, UserTypes>,
		response: Response,
		next: NextFunction
	) => {
		try {
			const userRefreshToken = request.cookies.userRefreshToken as string;
			const decoded = jwt.verify(
				userRefreshToken,
				process.env.JWT_REFRESH_TOKEN as string
			) as JwtPayload;

			if (!decoded) {
				return next(new ErrorHandler("Could not refresh token", 400));
			}
			const session = await redis.get(decoded.id as string);

			if (!session) {
				return next(
					new ErrorHandler(
						"Please login to access this resources!",
						401
					)
				);
			}

			const user = JSON.parse(session);
			request.user = user;

			const accessToken = jwt.sign(
				{ id: user._id },
				process.env.JWT_ACCESS_TOKEN as string,
				{
					expiresIn: "10m",
				}
			);

			const refreshToken = jwt.sign(
				{ id: user._id },
				process.env.JWT_REFRESH_TOKEN as string,
				{
					expiresIn: "3d",
				}
			);

			request.user = user;

			response.cookie("userAccessToken", accessToken, accessTokenOptions);
			response.cookie(
				"userRefreshToken",
				refreshToken,
				refreshTokenOptions
			);

			response.status(200).send({
				status: "success",
				accessToken,
			});
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

// get user info
export const getUserInfo = CatchAsyncError(
	(request: Request, response: Response, next: NextFunction) => {
		try {
			const userId = request.user?._id;
			getUserById(userId as string, response);
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

// social auth using nextAuth in the frontend

export const socialAuth = CatchAsyncError(
	async (
		request: Request<{}, {}, SocialAuthBody>,
		response: Response,
		next: NextFunction
	) => {
		try {
			const { name, email, avatar } = request.body;
			const user = await User.findOne({ email });
			if (!user) {
				const newUser = await User.create({ name, email, avatar });
				sendToken(newUser, 200, response);
			} else {
				sendToken(user, 200, response);
			}
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

// Update user info
export const updateUserInfo = CatchAsyncError(
	async (
		request: Request<{}, {}, UpdateUserInfo>,
		response: Response,
		next: NextFunction
	) => {
		try {
			const { name, email } = request.body;
			const userId = request.user?._id;
			const user = await User.findById(userId);

			if (email && user) {
				const isEmailExist = await User.findOne({ email });
				if (isEmailExist) {
					return next(new ErrorHandler("Email already exist", 409));
				}
				user.email = email;
			}
			if (name && user) {
				user.name = name;
			}

			await user?.save();

			await redis.set(userId as string, JSON.stringify(user));

			response.status(201).send({
				success: true,
				user,
			});
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

// Update user password
export const updatePassword = CatchAsyncError(
	async (
		request: Request<{}, {}, UpdatePassword>,
		response: Response,
		next: NextFunction
	) => {
		try {
			const { oldPassword, newPassword } = request.body;
			if (!oldPassword || !newPassword) {
				return next(
					new ErrorHandler("Please enter old and new password", 400)
				);
			}

			const user = await User.findById(request.user?._id).select(
				"+password"
			);

			if (user?.password === undefined) {
				return next(new ErrorHandler("Invalid user", 400));
			}

			const isPasswordMatch = await user?.comparePassword(oldPassword);
			if (!isPasswordMatch) {
				return next(new ErrorHandler("Invalid old password", 400));
			}
			user.password = newPassword;

			await user.save();

			const userWithoutPassword = {
				...user.toObject(),
				password: undefined,
			};
			response.status(201).send({
				success: true,
				user: userWithoutPassword,
			});
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

// Update profile picture
export const updateProfilePicture = CatchAsyncError(
	async (
		request: Request<{}, {}, UpdateProfilePicture>,
		response: Response,
		next: NextFunction
	) => {
		try {
			const { avatar } = request.body;

			const userId = request.user?._id;

			const user = await User.findById(userId).select("+password");

			if (avatar && user) {
				if (user?.avatar?.public_id) {
					await cloudinary.v2.uploader.destroy(
						user?.avatar?.public_id
					);

					const myCloud = await cloudinary.v2.uploader.upload(
						avatar,
						{
							folder: "avatars",
							width: 150,
						}
					);
					user.avatar = {
						public_id: myCloud.public_id,
						url: myCloud.secure_url,
					};
				} else {
					const myCloud = await cloudinary.v2.uploader.upload(
						avatar,
						{
							folder: "avatars",
							width: 150,
						}
					);
					user.avatar = {
						public_id: myCloud.public_id,
						url: myCloud.secure_url,
					};
				}
			}

			await user?.save();
			const userWithoutPassword = {
				...user?.toObject(),
				password: undefined,
			};

			await redis.set(
				userId as string,
				JSON.stringify(userWithoutPassword)
			);

			response.status(201).send({
				success: true,
				user: userWithoutPassword,
			});
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

/* This is only for admin */

// get all users
