import { Request, Response, NextFunction } from "express-serve-static-core";
import { CatchAsyncError } from "./asyncError";
import ErrorHandler from "../utils/errorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

// authenticated user
export const isAuthenticated = CatchAsyncError(
	async (request: Request, response: Response, next: NextFunction) => {
		const accessToken = request.cookies.userAccessToken as string;
		if (!accessToken) {
			return next(
				new ErrorHandler("Please login to access this resource", 400)
			);
		}
		const decoded = jwt.verify(
			accessToken,
			process.env.JWT_ACCESS_TOKEN as string
		) as JwtPayload;
		if (!decoded) {
			return next(new ErrorHandler("Access token is not valid", 400));
		}

		// // check if the access token is expired
		// if (decoded.exp && decoded.exp <= Date.now() / 1000) {
		// 	try {
		// 		updateAccessToken(request, response, next);
		// 	} catch (error) {
		// 		return next(error);
		// 	}
		// } else {
		const user = await redis.get(decoded.id);

		if (!user) {
			return next(
				new ErrorHandler("Please login to access this resource", 400)
			);
		}

		request.user = JSON.parse(user);

		next();
	}
);

// validate user role
export const authorizeRoles = (...roles: string[]) => {
	return (request: Request, response: Response, next: NextFunction) => {
		if (!roles.includes(request.user?.role || "")) {
			return next(
				new ErrorHandler(
					`Role: ${request.user?.role} is not allowed to access this resource`,
					403
				)
			);
		}
		next();
	};
};
