import { type Config } from "tailwindcss";

export default {
	content: ["./static/*.html", "./templates/**/*.html", "./handlers/**/*.ts"],
	theme: {
		extend: {},
	},
	plugins: [],
} satisfies Config;
