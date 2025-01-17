import { Handlebars, HandlebarsConfig } from "../deps.ts";

const hbsConfig: HandlebarsConfig = {
	baseDir: "templates",
	extname: ".hbs",
	layoutsDir: "layouts/",
	partialsDir: "partials/",
	cachePartials: true,
	defaultLayout: "",
	helpers: undefined,
	compilerOptions: undefined,
};

const handle = new Handlebars(hbsConfig);

/**
 * Ensures the existence of the templates and partials directories.
 */
export async function setupTemplates(): Promise<void> {
	try {
		await Deno.stat("templates");
	} catch {
		console.error("The templates directory does not exist.");
		Deno.exit(1);
	}

	try {
		await Deno.stat("templates/partials");
	} catch {
		console.error("The partials directory does not exist.");
		Deno.exit(1);
	}
}

/**
 * Renders a template using Handlebars.
 *
 * @param template - The name of the template (without extension, e.g., "index" for "index.hbs").
 * @param data - The data to be passed to the template.
 * @returns The rendered HTML string.
 */
export async function render(
	template: string,
	data: Record<string, unknown>
): Promise<string> {
	try {
		return await handle.renderView(`/pages/${template}`, data);
	} catch (error) {
		console.error(
			`Error rendering template '${template}': ${
				error instanceof Error ? error.message : String(error)
			}`
		);
		throw error;
	}
}
