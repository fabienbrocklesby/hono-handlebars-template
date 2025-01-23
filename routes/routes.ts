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
	.get("/", homeHandler)
	.get("/items", itemsPageHandler)
	.get("/api/items", getItemsHandler)
	.post("/api/items", createItemHandler)
	.get("/register", registerPageHandler)
	.post("/api/register", createUserHandler);

export default routes;
