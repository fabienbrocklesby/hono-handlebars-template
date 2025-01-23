/// <reference lib="deno.ns" />

import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { setupDB } from "../db/connection.ts";
import { setupTemplates } from "./render.ts";
import routes from "../routes/routes.ts";

const app = new Hono();

// Initialise templates and database
await setupTemplates();
setupDB();

app.use("/*", serveStatic({ root: "./static/" }));
app.route("/", routes);

Deno.serve({ port: 8000 }, app.fetch);
console.log("Server running at http://localhost:8000");
