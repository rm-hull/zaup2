/// <reference types="vitest" />
import { execSync } from "child_process";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig(() => {
  process.env.VITE_GIT_COMMIT_DATE = execSync("git log -1 --format=%cI").toString().trimEnd();
  process.env.VITE_GIT_COMMIT_HASH = execSync("git describe --always --dirty").toString().trimEnd();

  return {
    plugins: [react({ babel: { plugins: ["babel-plugin-react-compiler"] } })],
    base: "/zaup2",
    build: {
      sourcemap: true,
    },
    resolve: { tsconfigPaths: true },
  };
});
