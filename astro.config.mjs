import {defineConfig} from "astro/config";
import {readFileSync, readdirSync} from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from '@astrojs/sitemap';
import expressiveCode from "astro-expressive-code";
import {pluginLineNumbers} from "@expressive-code/plugin-line-numbers";

const blogDir = new URL("./src/content/blog/", import.meta.url);

// The sitemap integration only sees URLs, and astro.config runs before content
// collections exist, so blog dates are read straight from the post frontmatter.
const readPostDate = (file) => {
    const raw = readFileSync(new URL(file, blogDir), "utf8");
    const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const dateLine = frontmatter?.[1].match(/^date:\s*(.+)$/m);
    if (!dateLine) return null;
    const parsed = new Date(dateLine[1].trim().replace(/^["']|["']$/g, ""));
    return Number.isNaN(parsed.valueOf()) ? null : parsed.toISOString().slice(0, 10);
};

const blogLastmod = new Map();
for (const file of readdirSync(blogDir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const date = readPostDate(file);
    if (date) blogLastmod.set(file.replace(/\.mdx?$/, ""), date);
}

const blogIndexLastmod = [...blogLastmod.values()].sort().at(-1);

export default defineConfig({
    site: "https://www.ethanhann.com",

    vite: {
        plugins: [tailwindcss()],
    },

    integrations: [
        sitemap({
            serialize(item) {
                const slug = item.url.match(/\/blog\/([^/]+)\/$/)?.[1];
                if (slug && blogLastmod.has(slug)) {
                    item.lastmod = blogLastmod.get(slug);
                } else if (/\/blog\/$/.test(item.url) && blogIndexLastmod) {
                    item.lastmod = blogIndexLastmod;
                }
                return item;
            },
        }),
        expressiveCode({
            themes: ["github-dark"],
            plugins: [pluginLineNumbers()],
            styleOverrides: {
                borderColor: "#2a2622",
                borderRadius: "0.375rem",
                codeFontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                codeBackground: "#1a1918",
                codePaddingBlock: "1rem",
                codePaddingInline: "1.25rem",
            },
            defaultProps: {
                showLineNumbers: true,
                wrap: true,
                enableCopy: true,
            },
        }),
        mdx(),
    ],
});
