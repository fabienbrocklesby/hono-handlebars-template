import { Context } from "hono";
import { render } from "../src/render.ts";
import { fetchItems, createItem } from "../models/model.ts";

export function getItemsHandler(c: Context): Response {
	const items = fetchItems();
	return c.json(items);
}

export async function createItemHandler(c: Context): Promise<Response> {
	const body = await c.req.json();
	createItem(body.name, body.description);
	return c.json({ message: "Item created!" });
}

export function itemsPageHandler(c: Context): Promise<Response> {
	const items = fetchItems();
	return c.html(render("home", { title: "Items", items }));
}
