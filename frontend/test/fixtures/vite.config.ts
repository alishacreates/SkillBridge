import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  root: fileURLToPath(new URL("./", import.meta.url)),
  server: {
    host: "127.0.0.1",
    port: 3102,
    strictPort: true,
    fs: { allow: [fileURLToPath(new URL("../../", import.meta.url))] },
    proxy: { "/_next": "http://127.0.0.1:3101" },
  },
  plugins: [
    {
      name: "production-font-context",
      async transformIndexHtml(html) {
        // Reuse Next's generated font CSS/classes; do not create another font setup.
        const response = await fetch("http://127.0.0.1:3101/");
        if (!response.ok)
          throw new Error(
            "Build and start the production app on port 3101 first.",
          );
        const production = await response.text();
        const rootClasses = production.match(/<html[^>]*class="([^"]+)"/)?.[1];
        const stylesheets = production.match(
          /<link\b[^>]*rel="stylesheet"[^>]*>/g,
        );
        if (!rootClasses || !stylesheets)
          throw new Error("Production font context missing.");
        return html
          .replace(
            '<html lang="en">',
            `<html lang="en" class="${rootClasses}">`,
          )
          .replace("</head>", `${stylesheets.join("\n")}</head>`);
      },
    },
  ],
});
