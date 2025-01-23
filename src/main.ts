/// <reference lib="deno.ns" />

import { Hono, MiddlewareHandler } from "hono";
import { Session, sessionMiddleware, CookieStore } from "hono-sessions";
import { serveStatic } from "hono/deno";
import { setupDB } from "../db/connection.ts";
import { setupTemplates } from "./render.ts";
import routes from "../routes/routes.ts";

const app = new Hono();
const store = new CookieStore();

// Initialise templates and database
await setupTemplates();
setupDB();

app.use(
	"*",
	sessionMiddleware({
		store,
		cookieOptions: {
			secure: false,
			httpOnly: true,
			sameSite: "Lax",
		},
		expireAfterSeconds: 1800,
		encryptionKey: "nm9ClYta2yQvyRTwob1sYyUYoZNUlK7n",
	}) as unknown as MiddlewareHandler<
		{ Variables: { session: Session; session_key_rotation: boolean } },
		"*"
	>
);

app.use("/*", serveStatic({ root: "./static/" }));
app.route("/", routes);

Deno.serve({ port: 8000 }, app.fetch);
console.log("Server running at http://localhost:8000");
