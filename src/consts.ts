/**
 * Site-wide constants. Single source of truth for identity, navigation and
 * social links — import from here rather than hardcoding strings in pages.
 */

export const SITE_URL = 'https://youniss.dev';

export const SITE_TITLE = 'Youniss Kandah';

export const SITE_DESCRIPTION =
  'Applied AI & backend engineer in Austria. Production RAG, LLM document extraction, and agent infrastructure in safety-critical and document-heavy domains.';

export interface AuthorInfo {
  readonly name: string;
  readonly role: string;
  readonly location: string;
  readonly email: string;
  readonly github: string;
  readonly linkedin: string;
  readonly youtube: string;
  readonly githubHandle: string;
  readonly repoUrl: string;
}

export const AUTHOR: AuthorInfo = {
  name: 'Youniss Kandah',
  role: 'Applied AI & Backend Engineer',
  location: 'Austria',
  email: 'younisskandah@gmail.com',
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
 * Primary navigation. Contact is deliberately absent: it lives in the hero and
 * the footer, where an email address is more useful than another page.
 */
export const NAV: readonly NavItem[] = [
  { label: 'Work', href: '/work/', blurb: 'Case studies from shipped roles' },
  { label: 'Projects', href: '/projects/', blurb: 'The complete project archive' },
  { label: 'Writing', href: '/writing/', blurb: 'Notes and essays' },
  { label: 'Videos', href: '/videos/', blurb: 'YouTube, indexed' },
  { label: 'Papers', href: '/papers/', blurb: 'Reports and publications' },
  { label: 'Tools', href: '/tools/', blurb: 'Things you can use right now' },
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
  { label: 'Email', href: `mailto:${AUTHOR.email}`, handle: AUTHOR.email },
  { label: 'RSS', href: '/rss.xml' },
];

/** Where the RSS feed is published. Referenced by Head.astro and the footer. */
export const RSS_PATH = '/rss.xml';
