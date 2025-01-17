import { db } from "../src/db.ts";

interface Item {
	id: number;
	name: string;
	description: string;
}

export function fetchItems(): Item[] {
	const stmt = db.prepare("SELECT id, name, description FROM items");
	const items: Item[] = [];
	for (const row of stmt.all()) {
		items.push({
			id: row.id as number,
			name: row.name as string,
			description: row.description as string,
		});
	}
	return items;
}

export function createItem(name: string, description: string): void {
	const stmt = db.prepare(
		"INSERT INTO items (name, description) VALUES (?, ?)"
	);
	stmt.run(name, description);
}
