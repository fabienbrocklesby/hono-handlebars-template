import { Context } from "hono";
import { getUserByEmail } from "../models/user.ts";
import { render } from "../src/render.ts";
import { compare } from "bcrypt";
import { isHtmxRequest } from "../helpers/requestHelpers.ts";
import { MESSAGES } from "../helpers/messagesHelper.ts";
import { validateLoginForm } from "../helpers/validationHelper.ts";

interface LoginBody {
	email?: string;
	password?: string;
}

interface User {
	id: number;
	username: string;
	email: string;
	password_hash: string;
}

export async function loginPageHandler(c: Context): Promise<Response> {
	return await c.html(render("login", { title: "Login" }, "main"));
}

export async function loginUserHandler(c: Context): Promise<Response> {
	const isHtmx = isHtmxRequest(c);

	try {
		// Parse request body
		const body = await c.req.parseBody();
		const formData = validateLoginForm(body as Partial<LoginBody>);

		console.log("formData", formData);

		// Fetch user from the database
		const user = getUserByEmail(formData.email) as User | null;

		if (!user) {
			return c.html(MESSAGES.INVALID_CREDENTIALS, isHtmx ? 200 : 401);
		}

		// Validate password
		const passwordMatch = await compare(formData.password, user.password_hash);
		if (!passwordMatch) {
			return c.html(MESSAGES.INVALID_CREDENTIALS, isHtmx ? 200 : 401);
		}

		// Store user session
		const session = c.get("session");
		await Promise.all([
			session.set("userId", user.id),
			session.set("username", user.username),
		]);

		return c.html(MESSAGES.SUCCESS, 200);
	} catch (error) {
		if (error instanceof Error) {
			return c.html(
				`<p class="text-red-500">${error.message}</p>`,
				isHtmx ? 200 : 400
			);
		}

		return c.html(MESSAGES.INTERNAL_ERROR, isHtmx ? 200 : 500);
	}
}
