import { build, context } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

/**
 * Figma injects ui.html as a raw string with no real base URL, so a <script src="./ui.js">
 * never resolves — the JS must be inlined directly into the HTML.
 */
function writeInlinedHtml(js) {
  const template = readFileSync("src/ui/ui.html", "utf8");
  const html = template.replace('<script src="./ui.js"></script>', `<script>${js}</script>`);
  writeFileSync("dist/ui.html", html);
}

async function main() {
  mkdirSync("dist", { recursive: true });
  const watch = process.argv.includes("--watch");
  const buildOptions = {
    entryPoints: ["src/ui/ui.ts"],
    bundle: true,
    target: "es2020",
    format: "iife",
    write: false,
  };

  if (watch) {
    const ctx = await context({
      ...buildOptions,
      plugins: [
        {
          name: "inline-into-html",
          setup(b) {
            b.onEnd((result) => {
              if (result.outputFiles?.[0]) writeInlinedHtml(result.outputFiles[0].text);
            });
          },
        },
      ],
    });
    await ctx.watch();
    console.log("Watching src/ui/ for changes...");
  } else {
    const result = await build(buildOptions);
    writeInlinedHtml(result.outputFiles[0].text);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
