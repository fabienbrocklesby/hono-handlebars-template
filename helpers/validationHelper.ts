import { z } from "zod";

const loginSchema = z.object({
	email: z
		.string()
		.min(5, "Email is too short")
		.max(50, "Email is too long")
		.email("Invalid email format")
		.trim(),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(50, "Password is too long")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[0-9]/, "Password must contain at least one number")
		.regex(
			/[^a-zA-Z0-9]/,
			"Password must contain at least one special character"
		)
		.trim(),
});

const registerSchema = z.object({
	username: z
		.string()
		.min(3, "Username must be at least 3 characters long")
		.max(20, "Username must be less than 20 characters")
		.regex(
			/^[a-zA-Z0-9_]+$/,
			"Username can only contain letters, numbers, and underscores"
		)
		.trim(),
	email: loginSchema.shape.email,
	password: loginSchema.shape.password,
});

interface LoginFormData {
	email: string;
	password: string;
}

interface RegisterFormData {
	username: string;
	email: string;
	password: string;
}

export function validateLoginForm(body: Partial<LoginFormData>) {
	const result = loginSchema.safeParse(body);

	if (!result.success) {
		const errorMessage = result.error.errors
			.map((err) => err.message)
			.join(", ");
		throw new Error(errorMessage);
	}

	return result.data;
}

export function validateRegisterForm(body: Partial<RegisterFormData>) {
	const result = registerSchema.safeParse(body);

	if (!result.success) {
		const errorMessage = result.error.errors
			.map((err) => err.message)
			.join(", ");
		throw new Error(errorMessage);
	}

	return result.data;
}
