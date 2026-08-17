import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// `z` re-exported from 'astro:content' / 'astro:schema' is deprecated in Astro 7.
import { z } from 'astro/zod';

/** Every collection loads Markdown/MDX from src/content/<name>/. */
const contentIn = (name: string) =>
  glob({ pattern: '**/*.{md,mdx}', base: `./src/content/${name}` });

const linkSchema = z.object({
  label: z.string(),
  url: z.string(),
});

/** Deep-dive case studies for roles and major engagements. */
const work = defineCollection({
  loader: contentIn('work'),
  schema: z.object({
    title: z.string(),
    org: z.string(),
    role: z.string(),
    /** Human-readable, e.g. "Mar 2026 – Present". */
    period: z.string(),
    /** Ascending display order; lower comes first. */
    order: z.number(),
    summary: z.string(),
    stack: z.array(z.string()),
    metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    links: z.array(linkSchema).optional(),
  }),
});

export const PROJECT_CATEGORIES = [
  'ai-ml',
  'web',
  'tooling',
  'research',
  'teaching',
  'mobile',
  'data',
  'games',
  'infra',
] as const;

export const PROJECT_STATUSES = ['active', 'shipped', 'archived', 'experiment'] as const;

/** The complete indexed archive — one entry per repository. */
const projects = defineCollection({
  loader: contentIn('projects'),
  schema: z.object({
    title: z.string(),
    repoName: z.string(),
    summary: z.string(),
    year: z.number(),
    /** Human-readable span, e.g. "2024" or "2023 – 2024". */
    period: z.string(),
    category: z.enum(PROJECT_CATEGORIES),
    tags: z.array(z.string()),
    stack: z.array(z.string()),
    status: z.enum(PROJECT_STATUSES),
    repo: z.string().nullable(),
    demo: z.string().nullable(),
    paper: z.string().nullable(),
    private: z.boolean(),
    featured: z.boolean().default(false),
  }),
});

const posts = defineCollection({
  loader: contentIn('posts'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    lang: z.enum(['en', 'de']).default('en'),
    draft: z.boolean().default(false),
    /** Root-relative image path, e.g. "/assets/covers/v-dom-diagram.png". */
    hero: z.string().optional(),
  }),
});

export const PAPER_TYPES = [
  'technical-report',
  'seminar-paper',
  'thesis',
  'workshop',
  'conference',
  'preprint',
] as const;

const papers = defineCollection({
  loader: contentIn('papers'),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    year: z.number(),
    type: z.enum(PAPER_TYPES),
    /** Root-relative path under /papers/, or an absolute URL. */
    pdf: z.string(),
    url: z.string().nullable(),
    doi: z.string().nullable(),
    bibtex: z.string(),
  }),
});

export const TOOL_STATUSES = ['live', 'wip', 'retired'] as const;

const tools = defineCollection({
  loader: contentIn('tools'),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    url: z.string(),
    /** true when the tool is hosted on this domain (e.g. /tools/foo). */
    internal: z.boolean(),
    status: z.enum(TOOL_STATUSES),
    tags: z.array(z.string()),
    year: z.number(),
  }),
});

/**
 * Per-video extras. The entry id is the YouTube video ID; titles, thumbnails
 * and dates come from the synced feed, not from here.
 */
const videos = defineCollection({
  loader: contentIn('videos'),
  schema: z.object({
    resources: z.array(linkSchema).optional(),
    notes: z.string().optional(),
  }),
});

export const collections = { work, projects, posts, papers, tools, videos };
