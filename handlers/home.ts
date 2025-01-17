import { Context } from "hono";
import { render } from "../src/render.ts";

export function homeHandler(c: Context): Promise<Response> {
	const data = {
		title: "Welcome",
		content: "Hello, World!",
		items: [
			{ name: "Item 1", description: "Description for item 1" },
			{ name: "Item 2", description: "Description for item 2" },
			{ name: "Item 3", description: "Description for item 3" },
		],
	};
	return c.html(render("home", data));
}
