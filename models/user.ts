import { db } from "../db/connection.ts";

export interface User {
	id: number;
	username: string;
	email: string;
	password_hash: string;
	created_at: string; // ISO date string
}

/**
 * Retrieves a user from the database by their email address.
 *
 * @param email - The email address of the user.
 * @returns A promise that resolves to the User object if found, or undefined if not found.
 */
export function getUserByEmail(email: string): User | undefined {
	const stmt = db.prepare(`
    SELECT id, username, email, password_hash, created_at
    FROM users
    WHERE email = ?
    LIMIT 1
  `);

	try {
		const result = stmt.get([email]) as User | undefined;
		return result;
	} catch (error) {
		console.error(`Error fetching user by email (${email}):`, error);
		throw new Error("Failed to retrieve user.");
	} finally {
		stmt.finalize();
	}
}

/**
 * Retrieves a user from the database by their ID.
 *
 * @param id - The ID of the user.
 * @returns A promise that resolves to the User object if found, or undefined if not found.
 */
export function getUserById(id: number): User | undefined {
	const stmt = db.prepare(`
		SELECT id, username, email, password_hash, created_at
		FROM users
		WHERE id = ?
		LIMIT 1
	`);

	try {
		const result = stmt.get([id]) as User | undefined;
		return result;
	} catch (error) {
		console.error(`Error fetching user by ID (${id}):`, error);
		throw new Error("Failed to retrieve user.");
	} finally {
		stmt.finalize();
	}
}

/**
 * Creates a new user in the database.
 *
 * @param username - The username of the new user.
 * @param email - The email of the new user.
 * @param hashedPassword - The hashed password of the new user.
 * @returns A promise that resolves to the newly created user's ID.
 */
export function createUser(
	username: string,
	email: string,
	hashedPassword: string
): number {
	const stmt = db.prepare(`
    INSERT INTO users (username, email, password_hash)
    VALUES (?, ?, ?)
  `);

	try {
		stmt.run([username, email, hashedPassword]);
		const lastInsertRowId = db.lastInsertRowId;
		if (lastInsertRowId) {
			return lastInsertRowId as number;
		} else {
			throw new Error("Failed to retrieve the new user's ID.");
		}
	} catch (error) {
		if ((error as Error).message.includes("UNIQUE constraint failed")) {
			throw new Error("Username or email already exists.");
		}
		console.error("Error creating user:", error);
		throw new Error("Failed to create user.");
	} finally {
		stmt.finalize();
	}
}
