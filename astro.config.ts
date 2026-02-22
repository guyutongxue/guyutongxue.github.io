import { defineConfig } from "astro/config";
import tailwind from "@tailwindcss/vite";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { Root } from "mdast";
import type { VFile } from "vfile";

function initFrontmatter() {
  return function (tree: Root, file: VFile) {
    file.data.astro ??= {};
    file.data.astro.frontmatter ??= {};
    const title = tree.children.find(
      (node) => node.type === "heading" && node.depth === 1
    );
    if (title) {
      file.data.astro.frontmatter.realTitle = true;
    }
  };
}

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [initFrontmatter, remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  vite: {
    plugins: [tailwind()],
  },
});
