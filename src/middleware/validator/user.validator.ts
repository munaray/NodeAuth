import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async (
	request: Request,
	response: Response,
	next: NextFunction
) => {
	const result = validationResult(request);
	if (!result.isEmpty())
		response.status(400).send({
			error: result.array(),
		});
	next();
};

export const validateUserRegistration = [
	body("name")
		.isLength({ min: 4, max: 40 })
		.withMessage("name must be at least 4 character long")
		.isString()
		.withMessage("Name must be string"),

	body("email").isEmail().withMessage("Email is not valid").normalizeEmail(),

	body("password")
		.isLength({ min: 8, max: 25 })
		.withMessage("Password must be at min of 8 and max of 25 character")
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
		.withMessage(
			"Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
		),

	handleValidationErrors,
];

export const validateUserLogin = [
	body("email").isEmail().withMessage("Email is not valid").normalizeEmail(),

	body("password")
		.isLength({ min: 8, max: 25 })
		.withMessage("Password must be at min of 8 and max of 25 character")
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
		.withMessage(
			"Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
		),
	handleValidationErrors,
];
