import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths(), react()],
	test: {
		coverage: {
			provider: "istanbul", // or 'v8'
		},
		environment: "jsdom",
		setupFiles: "./vitest.setup.ts",
	},
});
