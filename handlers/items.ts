import { render } from "../src/render.ts";
import { fetchItems, createItem } from "../src/db.ts";

export async function getItemsHandler(c: any) {
	const items = fetchItems();
	return c.json(items);
}

export async function createItemHandler(c: any) {
	const body = await c.req.json();
	createItem(body.name, body.description);
	return c.json({ message: "Item created!" });
}

export async function itemsPageHandler(c: any) {
	const items = fetchItems();
	return c.html(render("home", { title: "Items", items }));
}
