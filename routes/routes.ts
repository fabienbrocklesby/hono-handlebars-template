import { Hono } from "hono";
import { homeHandler } from "../handlers/home.ts";

import {
	registerPageHandler,
	createUserHandler,
} from "../handlers/registerUser.ts";
import { loginPageHandler, loginUserHandler } from "../handlers/loginUser.ts";
import { logoutHandler } from "../handlers/logoutUser.ts";
import { getMeHandler } from "../handlers/getMe.ts";

import { authMiddleware } from "../middleware/authentication.ts";

const routes = new Hono()
	// home
	.use("/", authMiddleware)
	.get("/", homeHandler)

	// register
	.get("/register", registerPageHandler)
	.post("/api/register", createUserHandler)

	// login
	.get("/login", loginPageHandler)
	.post("/api/login", loginUserHandler)

	// logout
	.get("/logout", logoutHandler)

	// get me
	.use("/me", authMiddleware)
	.get("/me", getMeHandler);

export default routes;
