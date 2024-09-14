import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { UserTypes } from "../utils/types";
import jwt from "jsonwebtoken";
import "dotenv/config";

const passwordRegexPattern: RegExp =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema: Schema<UserTypes> = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please enter your name"],
		},
		email: {
			type: String,
			required: [true, "Please enter your email"],
			validate: {
				validator: (value: string) => {
					return emailRegexPattern.test(value);
				},
				message: "Please enter a valid email",
			},
			unique: true,
		},
		password: {
			type: String,
			select: false,
			validate: {
				validator: (value: string) => {
					return passwordRegexPattern.test(value);
				},
				message:
					"Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
			},
		},
		avatar: {
			public_id: { type: String, default: "" },
			url: { type: String, default: "" },
		},
		role: {
			type: String,
			default: "user",
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: { type: String },
		resetPasswordExpire: { type: Date },
	},
	{ timestamps: true }
);

// Hash Password before saving
const saltRounds = 10;

UserSchema.pre<UserTypes>("save", function (next) {
	if (!this.isModified("password")) return next();

	try {
		const salt = bcrypt.genSaltSync(saltRounds);
		this.password = bcrypt.hashSync(this.password, salt);
		next();
	} catch (error: any) {
		next(error);
	}
});

// Compare plain password with hashed password
UserSchema.methods.comparePassword = function (
	plain: string
): Promise<boolean> {
	return new Promise((resolve, reject) => {
		try {
			const isMatch = bcrypt.compareSync(plain, this.password);
			resolve(isMatch);
		} catch (error) {
			reject(error);
		}
	});
};

// sign access token
UserSchema.methods.SignAccessToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_ACCESS_TOKEN || "", {
		expiresIn: "10m",
	});
};

// sign refresh token
UserSchema.methods.SignRefreshToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_TOKEN || "", {
		expiresIn: "3d",
	});
};

const User: Model<UserTypes> = mongoose.model("User", UserSchema);

export default User;
