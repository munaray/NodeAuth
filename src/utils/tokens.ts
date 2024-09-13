import { Request, Response, NextFunction } from "express-serve-static-core";
import {
	ActivationToken,
	RegistrationData,
	UserTypes,
	TokenOptions,
} from "../utils/types";
import jwt, { Secret } from "jsonwebtoken";
import { redis } from "./redis";
import "dotenv/config";
import otpGenerator from "otp-generator";

export const createActivationToken = (
	user: RegistrationData
): ActivationToken => {
	const activationCode = otpGenerator.generate(6, {
		digits: true,
		lowerCaseAlphabets: false,
		upperCaseAlphabets: false,
		specialChars: false,
	});

	const token = jwt.sign(
		{
			user,
			activationCode,
		},
		process.env.JWT_ACTIVATION_SECRET as Secret,
		{
			expiresIn: "10m",
		}
	);

	return { token, activationCode };
};

const accessTokenExpire = parseInt(
	process.env.JWT_ACCESS_TOKEN_EXPIRE || "300",
	10
);
const refreshTokenExpire = parseInt(
	process.env.JWT_REFRESH_TOKEN_EXPIRE || "1200",
	10
);

// cookies options

export const accessTokenOptions: TokenOptions = {
	maxAge: accessTokenExpire * 60 * 60 * 1000,
	expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
	httpOnly: true,
	sameSite: "lax",
};

export const refreshTokenOptions: TokenOptions = {
	maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
	expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
	httpOnly: true,
	sameSite: "lax",
};

export const sendToken = async (
	user: UserTypes,
	statusCode: number,
	response: Response
) => {
	const accessToken = user.SignAccessToken();
	const refreshToken = user.SignRefreshToken();

	// Exclude password from user object
	const userWithoutPassword = { ...user.toObject(), password: undefined };

	// upload session to redis
	redis.set(String(user._id), JSON.stringify(userWithoutPassword));

	// secure true in production
	if (process.env.NODE_ENV === "production") {
		accessTokenOptions.secure = true;
	}

	response.cookie("userAccessToken", accessToken, accessTokenOptions);
	response.cookie("userRefreshToken", refreshToken, refreshTokenOptions);

	response.status(statusCode).send({
		success: true,
		user: userWithoutPassword,
		accessToken,
	});
};
