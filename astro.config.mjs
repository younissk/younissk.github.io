// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  site: 'https://youniss.dev',

  // The built site is COMMITTED to git and served directly by GitHub Pages
  // (Settings → Pages → main branch, /docs folder). Nothing in the publish
  // path needs Node, npm or CI — if this toolchain stops working in ten
  // years, the HTML in docs/ still serves. See SUCCESSION.md.
  outDir: './docs',

  markdown: {
    // Astro 7: plugins go through the unified() processor factory, not the
    // deprecated markdown.remarkPlugins / markdown.rehypePlugins keys.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/draft/'),
    }),
    react(),
  ],
});
