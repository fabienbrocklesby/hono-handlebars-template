import { Context } from "hono";

export function isHtmxRequest(c: Context): boolean {
	return c.req.header("HX-Request") === "true";
}
