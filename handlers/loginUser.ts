import { Context } from "hono";
import { getUserByEmail } from "../models/user.ts";
import { render } from "../src/render.ts";

import { compare } from "bcrypt";

interface LoginBody {
	email?: string;
	password?: string;
}

export function loginPageHandler(c: Context): Promise<Response> {
	return c.html(render("login", { title: "Login" }, "main"));
}

export async function loginUserHandler(c: Context): Promise<Response> {
	try {
		const body = await c.req.parseBody();
		const { email, password } = body as LoginBody;
		console.log(body);

		if (!email || !password) {
			return c.html(
				'<p class="text-red-500">Missing required fields.</p>',
				200
			);
		}

		const user = getUserByEmail(email);
		console.log(user);

		if (!user) {
			return c.html(
				'<p class="text-red-500">Invalid email or password.</p>',
				200
			);
		}

		const passwordMatch = await compare(password, user.password_hash);
		if (!passwordMatch) {
			return c.html(
				'<p class="text-red-500">Invalid email or password.</p>',
				200
			);
		}

		const session = c.get("session");

		await session.set("userId", user.id);
		await session.set("username", user.username);

		return c.html('<p class="text-green-500">Login successful.</p>', 200);
	} catch (error) {
		console.error("Error during login:", error);
		return c.html('<p class="text-red-500">Internal server error.</p>', 200);
	}
}
