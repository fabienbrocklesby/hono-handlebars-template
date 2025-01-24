import { Context } from "hono";
import { getUserById } from "../models/user.ts";
import { MESSAGES } from "./messagesHelper.ts";

interface User {
	id: number;
	username: string;
	email: string;
}

export async function getAuthenticatedUser(c: Context): Promise<User | null> {
	try {
		const session = c.get("session");
		const userId = await session.get("userId");

		if (!userId) {
			throw new Error(MESSAGES.UNAUTHORIZED);
		}

		const user = getUserById(userId) as User | null;
		if (!user) {
			throw new Error(MESSAGES.USER_NOT_FOUND);
		}

		return user;
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error fetching authenticated user:", error.message);
		} else {
			console.error("Error fetching authenticated user:", error);
		}

		throw new Error(MESSAGES.INTERNAL_ERROR);
	}
}
