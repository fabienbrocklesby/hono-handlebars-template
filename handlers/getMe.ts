import { Context } from "hono";
import { getAuthenticatedUser } from "../helpers/authHelper.ts";
import { MESSAGES } from "../helpers/messagesHelper.ts";

export async function getMeHandler(c: Context): Promise<Response> {
	try {
		const user = await getAuthenticatedUser(c);

		if (!user) {
			return c.html(MESSAGES.USER_NOT_FOUND, 404);
		}

		return c.json(
			{
				success: true,
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
				},
			},
			200
		);
	} catch (error) {
		const err = error as Error;
		return c.html(
			`<p class="text-red-500">${err.message}</p>`,
			err.message === MESSAGES.UNAUTHORIZED ? 401 : 500
		);
	}
}
