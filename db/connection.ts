import { Database } from "sqlite";

export const db = new Database("./db/database.sqlite");

async function applyMigrations(migrationPath: string): Promise<void> {
	try {
		console.log("Applying database migrations...");

		for await (const entry of Deno.readDir(migrationPath)) {
			if (entry.isFile && entry.name.endsWith(".sql")) {
				console.log(`🔍 Processing migration: ${entry.name}`);

				const sql = await Deno.readTextFile(`${migrationPath}/${entry.name}`);
				db.exec(sql);
				console.log(`✅ Migration applied: ${entry.name}`);
			}
		}

		console.log("All migrations applied successfully.");
	} catch (error) {
		console.error("❌ Error applying migrations:", error);
	}
}

export async function setupDB(): Promise<void> {
	const stmt = db.prepare("PRAGMA journal_mode=WAL;");
	const [journalMode] = stmt.value<[string]>()!;
	stmt.finalize();

	if (journalMode.toLowerCase() !== "wal") {
		console.error(
			`Failed to set journal mode to WAL. Current mode: ${journalMode}`
		);
		return;
	}

	await applyMigrations("./db/migrations");

	console.log("Database setup complete.");
}
