import fs from "node:fs/promises";
import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./src/app.ts"],
  bundle: true,
  outfile: "./build/app.js",
});

await fs.copyFile("./src/index.html", "./build/index.html");
