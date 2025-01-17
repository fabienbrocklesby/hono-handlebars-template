/// <reference lib="deno.ns" />

import { Hono } from "npm:hono";
import { setupDB } from "./db.ts";
import { setupTemplates } from "./render.ts";
import { homeHandler } from "../handlers/home.ts";
import {
	getItemsHandler,
	createItemHandler,
	itemsPageHandler,
} from "../handlers/items.ts";

const app = new Hono();

// Initialise templates and database
await setupTemplates();
setupDB();

// Routes
app.get("/", homeHandler);
app.get("/items", itemsPageHandler);
app.get("/api/items", getItemsHandler);
app.post("/api/items", createItemHandler);

Deno.serve({ port: 8000 }, app.fetch);
console.log("Server running at http://localhost:8000");
