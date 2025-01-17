import { Database } from "../deps.ts";

export const db = new Database("./db/database.sqlite");

export function setupDB() {
	const stmt = db.prepare("PRAGMA journal_mode=WAL;");
	const [journalMode] = stmt.value<[string]>()!;
	stmt.finalize();

	if (journalMode.toLowerCase() !== "wal") {
		console.error(
			`Failed to set journal mode to WAL. Current mode: ${journalMode}`
		);
		return;
	}

	db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT
    );
  `);
}
