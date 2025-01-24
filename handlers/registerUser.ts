import { Context } from "hono";
import { render } from "../src/render.ts";
import { createUser, getUserByEmail } from "../models/user.ts";
import { hash, genSalt } from "bcrypt";
import { isHtmxRequest } from "../helpers/requestHelpers.ts";
import { MESSAGES } from "../helpers/messagesHelper.ts";
import { validateRegisterForm } from "../helpers/validationHelper.ts";

interface RegisterBody {
	username: string;
	email: string;
	password: string;
}

interface User {
	id: number;
	username: string;
	email: string;
	password_hash: string;
}

export async function registerPageHandler(c: Context): Promise<Response> {
	return c.html(render("register", { title: "Register" }, "main"));
}

export async function createUserHandler(c: Context): Promise<Response> {
	const isHtmx = isHtmxRequest(c);

	try {
		// Parse and validate request body
		const body = await c.req.parseBody();
		const formData = validateRegisterForm(body as Partial<RegisterBody>);

		console.log("Registering user:", formData);

		// Check if the email or username already exists
		const existingUser = getUserByEmail(formData.email);
		if (existingUser) {
			return c.html(MESSAGES.USER_EXISTS, isHtmx ? 200 : 409);
		}

		// Hash the password securely
		const hashedPassword = await hash(formData.password, await genSalt(10));

		// Save the new user to the database
		createUser(formData.username, formData.email, hashedPassword);

		return c.html(MESSAGES.REGISTRATION_SUCCESS, 201);
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
