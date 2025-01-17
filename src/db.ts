import { DB } from "https://deno.land/x/sqlite/mod.ts";

export const db = new DB("./db/database.sqlite");

export function setupDB() {
	db.execute(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT
    )
  `);
}

export function fetchItems() {
	return [...db.query("SELECT id, name, description FROM items")];
}

export function createItem(name: string, description: string) {
	db.query("INSERT INTO items (name, description) VALUES (?, ?)", [
		name,
		description,
	]);
}
