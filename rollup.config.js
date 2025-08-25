import terser from "@rollup/plugin-terser";
import typescript from "rollup-plugin-typescript2";

export default {
    input: "src/index.ts",
    output: {
        file: "dist/tracker.js",
        format: "iife", // script simples
        name: "Tracker",
    },
    plugins: [typescript(), terser()],
};
