// @ts-check
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/**
 * Wrap every article table in a horizontal scroll container.
 *
 * A table wider than the prose column used to overflow it, and because body
 * sets `overflow-x: clip` the overhang was unreachable rather than scrollable —
 * on a phone the last column of the Falcon Twig results table could not be read
 * at all. The wrapper gets a tabindex so the scroll box is operable by keyboard,
 * and a label so a screen reader announces what the region is.
 *
 * Hand-rolled rather than pulling in unist-util-visit: it is fifteen lines, and
 * a dependency that only exists transitively today is exactly the kind of thing
 * that quietly breaks a build years from now.
 */
function rehypeScrollableTables() {
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        walk(child);
        if (child.type !== 'element' || child.tagName !== 'table') return child;
        return {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['table-scroll'],
            tabIndex: 0,
            role: 'region',
            'aria-label': 'Table, scrollable',
          },
          children: [child],
        };
      });
    };
    walk(tree);
  };
}

/**
 * Real publication dates, keyed by route, for sitemap `lastmod`.
 *
 * Read straight off the source rather than passed in from anywhere: videos from
 * the synced JSON, posts and papers from their own frontmatter. A page with no
 * honest date simply gets no lastmod.
 */
const LASTMOD = (() => {
  const map = new Map();
  const iso = (value) => {
    const t = Date.parse(value);
    return Number.isFinite(t) ? new Date(t).toISOString() : null;
  };

  try {
    const videos = JSON.parse(readFileSync('src/data/videos.json', 'utf8'));
    for (const v of videos) {
      const d = iso(v.publishedAt);
      if (d) map.set(`/videos/${v.id}/`, d);
    }
  } catch {
    /* No synced videos yet. Fine — those routes just get no lastmod. */
  }

  // Posts live in src/content/posts/<slug>/index.mdx, papers in a flat file.
  const frontmatter = (file) => {
    const text = readFileSync(file, 'utf8');
    const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
    return block ? block[1] : '';
  };

  const postsDir = 'src/content/posts';
  if (existsSync(postsDir)) {
    for (const slug of readdirSync(postsDir)) {
      for (const name of ['index.mdx', 'index.md']) {
        const file = join(postsDir, slug, name);
        if (!existsSync(file)) continue;
        const m = /^date:\s*["']?([0-9]{4}-[0-9]{2}-[0-9]{2})/m.exec(frontmatter(file));
        const d = m && iso(m[1]);
        if (d) map.set(`/writing/${slug}/`, d);
      }
    }
  }

  const papersDir = 'src/content/papers';
  if (existsSync(papersDir)) {
    for (const name of readdirSync(papersDir)) {
      if (!name.endsWith('.md')) continue;
      const m = /^year:\s*([0-9]{4})/m.exec(frontmatter(join(papersDir, name)));
      const d = m && iso(`${m[1]}-01-01`);
      if (d) map.set(`/papers/${name.replace(/\.md$/, '')}/`, d);
    }
  }

  return map;
})();

// https://astro.build/config
export default defineConfig({
  site: 'https://youniss.dev',

  /**
   * Redirects from the Docusaurus site this replaced.
   *
   * Search Console for the year to Sep 2026 says 89% of impressions and 72% of
   * clicks landed on URLs that this migration deleted: /posts/*, /docs/* and
   * the hashed /assets/files/*.pdf paths. Every one of them 404s. That is a
   * year of accumulated ranking pointed at a dead end.
   *
   * GitHub Pages cannot issue a 301, so with a static build Astro emits a small
   * HTML page carrying a meta refresh and a canonical link. Weaker and slower
   * than a real redirect, and still far better than a 404 — the canonical is
   * what actually passes the signal on.
   *
   * The PDFs are NOT redirected. A .pdf URL that answers with HTML is broken for
   * anyone who follows it, so those three files are restored byte-for-byte at
   * their old hashed paths under public/assets/files/ instead. The Falcon Twig
   * report alone was 3,180 impressions, 43% of the year.
   */
  redirects: {
    // The posts, in impression order.
    '/posts/falcon-fine-tuning': '/writing/falcon-twig/',
    '/posts/falcon-fine-tuning/': '/writing/falcon-twig/',
    '/posts/dcase-2025-challenge': '/papers/dcase-2025-language-based-audio-retrieval/',
    '/posts/dcase-2025-challenge/': '/papers/dcase-2025-language-based-audio-retrieval/',
    '/posts/shopify-search': '/projects/shopify-search/',
    '/posts/shopify-search/': '/projects/shopify-search/',
    '/posts/llm-recommender-systems': '/papers/llm-based-recommender-systems/',
    '/posts/llm-recommender-systems/': '/papers/llm-based-recommender-systems/',

    // The index and its pagination.
    '/posts': '/writing/',
    '/posts/': '/writing/',
    '/posts/page/2': '/writing/',
    '/posts/page/2/': '/writing/',

    // Tags that still exist keep their topic; the rest go to the index rather
    // than to a tag page that would be empty.
    '/posts/tags/fine-tuning': '/writing/tags/fine-tuning/',
    '/posts/tags/fine-tuning/': '/writing/tags/fine-tuning/',
    '/posts/tags/web-dev': '/writing/tags/web-dev/',
    '/posts/tags/web-dev/': '/writing/tags/web-dev/',
    '/posts/tags/recommender-systems': '/writing/',
    '/posts/tags/recommender-systems/': '/writing/',
    '/posts/tags/multimodal': '/writing/',
    '/posts/tags/multimodal/': '/writing/',
    '/posts/tags/construction': '/writing/',
    '/posts/tags/construction/': '/writing/',
    '/posts/tags/search-engine': '/writing/',
    '/posts/tags/search-engine/': '/writing/',

    // The old docs tree has no equivalent; send each to its nearest subject.
    '/docs/recommender-systems/evaluating-rec-sys': '/papers/llm-based-recommender-systems/',
    '/docs/recommender-systems/evaluating-rec-sys/': '/papers/llm-based-recommender-systems/',
    '/docs/category/unsupervised-learning': '/writing/',
    '/docs/category/unsupervised-learning/': '/writing/',

    /* No entry for '/contact'. GitHub Pages already answers a slashless path
       for a real directory with its own 301, and declaring the redirect here
       made Astro treat /contact/ as a redirect target rather than a page — it
       dropped straight out of the sitemap. Verified live: /contact, /projects
       and /library all already 301 to their trailing-slash form. */
  },

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
      rehypePlugins: [rehypeKatex, rehypeScrollableTables],
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
    /**
     * The sitemap is generated on every build from the routes Astro actually
     * emitted, so it can never list a page that does not exist or miss one that
     * does. Nothing to maintain by hand.
     *
     * `lastmod` is attached only where a real date exists — the publication date
     * of a video, post or paper. A build-time timestamp on every URL would be
     * worse than nothing: it would tell a crawler the whole site changed every
     * night, which is the opposite of what lastmod is for.
     */
    sitemap({
      filter: (page) => !page.includes('/draft/') && !page.endsWith('/404'),
      serialize: (item) => {
        const path = new URL(item.url).pathname;
        const lastmod = LASTMOD.get(path);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
    react(),
  ],
});
