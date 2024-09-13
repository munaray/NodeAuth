import { Response } from "express-serve-static-core";
import { redis } from "../utils/redis";
import User from "../schemas/user.schema";

// get user by id
export const getUserById = async (id: string, response: Response) => {
	const redisUser = await redis.get(id);

	if (redisUser) {
		const user = JSON.parse(redisUser);

		response.status(200).send({
			success: true,
			user,
		});
	}
};

//  Get all users
export const getAllUserService = async (response: Response) => {
	const users = await User.find().sort({ createdAt: -1 });

	response.status(200).send({
		success: true,
		users,
	});
};

// Update user role
export const updateUserRoleService = async (
	response: Response,
	id: string,
	role: string
) => {
	const user = await User.findByIdAndUpdate(id, { role }, { new: true });

	response.status(200).send({
		success: true,
		user,
	});
};