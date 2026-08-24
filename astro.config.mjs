// @ts-check
import { readFileSync } from 'node:fs';

import { defineConfig } from 'astro/config';

/*
 * Video ids, read straight off the synced data. The video routes emit a real
 * page at the slugified title plus a noindex redirect stub at the old id URL,
 * and a sitemap that lists noindex URLs is asking a crawler to fetch pages it
 * has been told to ignore.
 */
const VIDEO_IDS = new Set(
  JSON.parse(readFileSync(new URL('./src/data/videos.json', import.meta.url), 'utf8')).map(
    (v) => v.id,
  ),
);

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
      filter: (page) => {
        if (page.includes('/draft/')) return false;
        const segment = page.replace(/\/$/, '').split('/').pop();
        return !VIDEO_IDS.has(segment);
      },
    }),
    react(),
  ],
});
