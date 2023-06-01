import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import tailwind from "@astrojs/tailwind";

function moreFrontmatter() {
  return function ( /** @type import("remark-math").Root */tree, file) {
    file.data.astro.frontmatter.layout = "/src/layouts/BlogPostLayout.astro";
    const title = tree.children.find(node => node.type === "heading" && node.depth === 1);
    if (title) {
      file.data.astro.frontmatter.realTitle = true;
    }
  };
}


// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [moreFrontmatter, remarkMath],
    rehypePlugins: [rehypeKatex]
  },
  integrations: [tailwind()]
});