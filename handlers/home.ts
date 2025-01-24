import { Context } from "hono";
import { render } from "../src/render.ts";
import { getAuthenticatedUser } from "../helpers/authHelper.ts";

interface HomeData {
	title: string;
	content: string;
	user: { name: string; email: string };
	items: { name: string; description: string }[];
}

export async function homeHandler(c: Context): Promise<Response> {
	try {
		const data = await getHomePageData(c);
		return c.html(
			render("home", data as unknown as Record<string, unknown>),
			200
		);
	} catch (error) {
		console.error("Error rendering home page:", error);
		return c.html(
			'<p class="text-red-500">An error occurred while loading the page.</p>',
			500
		);
	}
}

async function getHomePageData(c: Context): Promise<HomeData> {
	const user = await getAuthenticatedUser(c);

	if (!user) {
		throw new Error("User not authenticated");
	}

	return {
		title: "Welcome",
		content: "Hello, World!",
		user: { name: user.username, email: user.email },
		items: [
			{ name: "Item 1", description: "Description for item 1" },
			{ name: "Item 2", description: "Description for item 2" },
			{ name: "Item 3", description: "Description for item 3" },
		],
	};
}
