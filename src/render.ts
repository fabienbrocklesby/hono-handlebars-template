import { Handlebars, HandlebarsConfig } from "handlebars";

let hbsConfig: HandlebarsConfig = {
	baseDir: "templates",
	extname: ".html",
	layoutsDir: "layouts/", // Directory for layout templates
	partialsDir: "partials/", // Directory for partial templates
	cachePartials: true,
	defaultLayout: "", // Optional: default layout name (e.g., "main.hbs")
	helpers: undefined,
	compilerOptions: undefined,
};

const handle = new Handlebars(hbsConfig);

/**
 * Ensures the existence of the templates, partials, and layouts directories.
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

	try {
		await Deno.stat("templates/layouts");
	} catch {
		console.error("The layouts directory does not exist.");
		Deno.exit(1);
	}
}

/**
 * Renders a template using Handlebars with an optional layout.
 *
 * @param template - The name of the template (without extension, e.g., "index" for "index.hbs").
 * @param data - The data to be passed to the template.
 * @param layout - (Optional) The name of the layout (without extension, e.g., "main" for "main.hbs").
 * @returns The rendered HTML string.
 */
export async function render(
	template: string,
	data: Record<string, unknown>,
	layout?: string
): Promise<string> {
	try {
		// Render the main template
		const templatePath = `/pages/${template}`; // Assuming baseDir is "templates"
		const renderedTemplate = await handle.renderView(templatePath, data);

		const selectedLayout = layout || "main";

		if (selectedLayout) {
			// Render the layout with the main template embedded as `body`
			const layoutPath = `/layouts/${selectedLayout}`;

			return await handle.renderView(layoutPath, {
				...data,
				body: renderedTemplate,
			});
		}

		// If no layout is specified, return the rendered template directly
		return renderedTemplate;
	} catch (error) {
		console.error(
			`Error rendering template '${template}': ${
				error instanceof Error ? error.message : String(error)
			}`
		);
		throw error;
	}
}
