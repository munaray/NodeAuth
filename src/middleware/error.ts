import { Request, Response, NextFunction } from "express-serve-static-core";
import ErrorHandler from "../utils/errorHandler";

export const middlewareErrorHandler = (
	err: any,
	request: Request,
	response: Response,
	next: NextFunction
) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || "Internal server error";

	// wrong mongodb id error
	if (err.name === "CastError") {
		const message = `Resource not found. Invalid: ${err.path}`;
		err = new ErrorHandler(message, 400);
	}

	// mongoose validation error
	if (err.name === "ValidationError") {
		const message = Object.values(err.error)
			.map((value: any) => value.message)
			.join(", ");
		err = new ErrorHandler(message, 400);
	}

	// duplicate key error
	if (err.code === 11000) {
		const message = `Duplicate field value entered: ${Object.keys(
			err.keyValue
		).join(", ")}`;
		err = new ErrorHandler(message, 400);
	}

	// jwt authentication error
	if (err.name === "JsonWebTokenError") {
		const message = "Invalid token, please log in again.";
		err = new ErrorHandler(message, 401);
	}

	// jwt expired error
	if (err.name === "TokenExpiredError") {
		const message = "Your token has expired, please log in again.";
		err = new ErrorHandler(message, 401);
	}

	// missing required parameters
	if (err.name === "MissingRequiredParameters") {
		const message = "Missing required parameters.";
		err = new ErrorHandler(message, 400);
	}

	// unauthorized access
	if (err.name === "UnauthorizedAccess") {
		const message = "Unauthorized access.";
		err = new ErrorHandler(message, 401);
	}

	// forbidden access
	if (err.name === "ForbiddenAccess") {
		const message = "Forbidden access.";
		err = new ErrorHandler(message, 403);
	}

	response.status(err.statusCode).json({
		success: false,
		message: err.message,
	});
};
