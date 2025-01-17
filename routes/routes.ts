import { Hono } from "hono";
import { homeHandler } from "../handlers/home.ts";
import {
	getItemsHandler,
	createItemHandler,
	itemsPageHandler,
} from "../handlers/items.ts";

const routes = new Hono()
	.get("/", homeHandler)
	.get("/items", itemsPageHandler)
	.get("/api/items", getItemsHandler)
	.post("/api/items", createItemHandler);

export default routes;
