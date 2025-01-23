import { Context } from "hono";
import { render } from "../src/render.ts";
import { createUser, getUserByEmail } from "../models/user.ts";
import { hash, genSalt } from "bcrypt";

export function registerPageHandler(c: Context): Promise<Response> {
	return c.html(render("register", { title: "Register" }, "main"));
}

interface RegisterBody {
	username?: string;
	email?: string;
	password?: string;
}

export async function createUserHandler(c: Context): Promise<Response> {
	try {
		const body = await c.req.parseBody();

		const { username, email, password } = body as RegisterBody;

		if (!username || !email || !password) {
			return c.html(
				`<p class="text-red-500">Missing required fields.</p>`,
				200
			);
		}

		const existingUser = getUserByEmail(email);
		if (existingUser) {
			return c.html(
				`<p class="text-red-500">Username or email already exists.</p>`,
				200
			);
		}

		const hashedPassword = await hash(password, await genSalt(10));

		createUser(username, email, hashedPassword);

		return c.html(
			`<p class="text-green-500">User created successfully.</p>`,
			201
		);
	} catch (error) {
		console.error("Error creating user:", error);
		return c.html(`<p class="text-red-500">Internal server error.</p>`, 200);
	}
}
