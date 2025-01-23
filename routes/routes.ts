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
import { loginPageHandler, loginUserHandler } from "../handlers/loginUser.ts";
import { logoutHandler } from "../handlers/logoutUser.ts";

import { authMiddleware } from "../middleware/authentication.ts";

const routes = new Hono()
	// home
	.use("/", authMiddleware)
	.get("/", homeHandler)

	// items
	.get("/items", itemsPageHandler)
	.get("/api/items", getItemsHandler)
	.post("/api/items", createItemHandler)

	// register
	.get("/register", registerPageHandler)
	.post("/api/register", createUserHandler)

	// login
	.get("/login", loginPageHandler)
	.post("/api/login", loginUserHandler)

	// logout
	.get("/logout", logoutHandler);

export default routes;
