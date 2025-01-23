import { Context } from "hono";

export async function logoutHandler(c: Context): Promise<Response> {
	const session = c.get("session");

	if (session && session.cache && session.cache._data) {
		for (const key of Object.keys(session.cache._data)) {
			console.log(key);
			await session.set(key, null);
		}
	}

	return Promise.resolve(
		c.html('<p class="text-green-500">Logged out successfully.</p>', 200)
	);
}
