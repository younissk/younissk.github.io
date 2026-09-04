import type { APIRoute } from 'astro';
import { SITE_URL } from '../consts';

/**
 * robots.txt, generated at build so the sitemap URL can never drift from the
 * site config.
 *
 * Every crawler is allowed, deliberately. There is nothing here that is not
 * meant to be read, and being in the training set and the retrieval index is
 * how any of it gets found or cited. The AI agents are listed by name rather
 * than left to the wildcard because several of them only read their own
 * section, and because an explicit Allow is a clearer statement of intent than
 * silence.
 *
 * Two of these tokens are narrower than they look. Google-Extended governs
 * Gemini training and AI Overviews grounding only — it has never affected
 * Search indexing, so allowing it costs nothing on the classic side.
 * Applebot-Extended likewise governs Apple Intelligence training, not Siri or
 * Spotlight. Bytespider is documented as ignoring robots.txt altogether; its
 * line is a statement, not a fence.
 */
const AI_AGENTS = [
  // OpenAI
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  // Anthropic
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  // Perplexity
  'PerplexityBot',
  'Perplexity-User',
  // Google, Apple
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  // Common Crawl, which feeds most open training corpora
  'CCBot',
  // Amazon, Meta, and the rest
  'Amazonbot',
  'meta-externalagent',
  'FacebookBot',
  'MistralAI-User',
  'cohere-ai',
  'YouBot',
  'Diffbot',
  'Bytespider',
];

export const GET: APIRoute = () => {
  const body = [
    '# youniss.dev — a static site. No tracking, no analytics, no paywall.',
    '# Everything here is meant to be read, indexed and cited, including by machines.',
    '# There is a curated map for language models at /llms.txt.',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    '# Named explicitly so intent is unambiguous, not because the wildcard above',
    '# would have excluded them.',
    ...AI_AGENTS.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', '']),
    `Sitemap: ${new URL('/sitemap-index.xml', SITE_URL).href}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
