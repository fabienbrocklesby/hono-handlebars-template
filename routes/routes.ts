import { Hono } from "hono";
import { homeHandler } from "../handlers/home.ts";
import {
	getItemsHandler,
	createItemHandler,
	itemsPageHandler,
} from "../handlers/items.ts";
import {
	registerPageHandler,
	createUserHandler,
} from "../handlers/registerUser.ts";

const routes = new Hono()
	// home
	.get("/", homeHandler)

	// items
	.get("/items", itemsPageHandler)
	.get("/api/items", getItemsHandler)
	.post("/api/items", createItemHandler)

	// register
	.get("/register", registerPageHandler)
	.post("/api/register", createUserHandler);

export default routes;
