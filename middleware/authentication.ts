import { Context, Next } from "hono";

export const authMiddleware = async (c: Context, next: Next) => {
	const session = c.get("session");
	const userId = await session.get("userId");

	if (!userId) {
		return c.html(
			'<p class="text-red-500">Unauthorized. Please log in.</p>',
			401
		);
	}

	await next();
};
