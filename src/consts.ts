/**
 * Site-wide constants. Single source of truth for identity, navigation and
 * social links — import from here rather than hardcoding strings in pages.
 */

export const SITE_URL = 'https://youniss.dev';

export const SITE_TITLE = 'Youniss Kandah';

export const SITE_DESCRIPTION =
  'Applied AI & backend engineer. Production RAG, LLM document extraction, and agent infrastructure in safety-critical and document-heavy domains.';

export interface AuthorInfo {
  readonly name: string;
  readonly role: string;
  readonly github: string;
  readonly linkedin: string;
  readonly youtube: string;
  readonly githubHandle: string;
  readonly repoUrl: string;
}

export const AUTHOR: AuthorInfo = {
  name: 'Youniss Kandah',
  role: 'Applied AI & Backend Engineer',
  github: 'https://github.com/younissk',
  linkedin: 'https://www.linkedin.com/in/youniss',
  youtube: 'https://www.youtube.com/@youniss-ml',
  githubHandle: 'younissk',
  repoUrl: 'https://github.com/younissk/younissk.github.io',
};

export interface NavItem {
  readonly label: string;
  readonly href: string;
  /** One-line hint — used for title attributes and menu subtext. */
  readonly blurb: string;
}

/**
 * Primary navigation. Contact sits at the end: there is no address on the site,
 * so the form is the only way through and it needs to be findable.
 */
export const NAV: readonly NavItem[] = [
  { label: 'Work', href: '/work/', blurb: 'Case studies from shipped roles' },
  { label: 'Projects', href: '/projects/', blurb: 'The complete project archive' },
  { label: 'Writing', href: '/writing/', blurb: 'Notes and essays' },
  { label: 'Videos', href: '/videos/', blurb: 'YouTube, indexed' },
  { label: 'Papers', href: '/papers/', blurb: 'Reports and publications' },
  { label: 'Contact', href: '/contact/', blurb: 'Send me a message' },
];

export interface SocialLink {
  readonly label: string;
  readonly href: string;
  /** Displayed handle, e.g. `@younissk`. Omitted for RSS/e-mail. */
  readonly handle?: string;
}

export const SOCIALS: readonly SocialLink[] = [
  { label: 'GitHub', href: AUTHOR.github, handle: '@younissk' },
  { label: 'LinkedIn', href: AUTHOR.linkedin, handle: '/in/youniss' },
  { label: 'YouTube', href: AUTHOR.youtube, handle: '@youniss-ml' },
  { label: 'Contact', href: '/contact/' },
  { label: 'RSS', href: '/rss.xml' },
];

/** Where the RSS feed is published. Referenced by Head.astro and the footer. */
export const RSS_PATH = '/rss.xml';

/**
 * Where the contact form POSTs.
 *
 * The site has no server, so a form needs somebody else's endpoint. Paste one
 * here (Web3Forms access key URL, Formspree form URL, anything that accepts a
 * plain multipart POST). Leave it empty and the contact page says so plainly
 * instead of rendering a form that silently drops messages.
 *
 * This is the ONE third-party dependency on the site. If the service folds, the
 * form stops working — SUCCESSION.md explains how to drop it and go back to a
 * plain address.
 */
export const CONTACT_ENDPOINT = '';

/**
 * Web3Forms wants the key in a hidden field rather than the URL. Ignored when
 * empty, so Formspree-style endpoints need nothing here.
 */
export const CONTACT_ACCESS_KEY = '';
