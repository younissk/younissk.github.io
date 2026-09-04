/**
 * Site-wide constants. Single source of truth for identity, navigation and
 * social links — import from here rather than hardcoding strings in pages.
 */

export const SITE_URL = 'https://youniss.dev';

export const SITE_TITLE = 'Youniss';

export const SITE_DESCRIPTION =
  'Applied AI engineer. I work on retrieval and document extraction, mostly for people who cannot send their documents to somebody else’s API.';

/**
 * Stable identifier for the one Person node in the site's structured data.
 *
 * Every authored thing — paper, post, video, project — references this instead
 * of repeating an author block, so a consumer sees one person with many works
 * rather than one anonymous author per page.
 */
export const PERSON_ID = `${SITE_URL}/#person`;

export interface AuthorInfo {
  readonly name: string;
  readonly role: string;
  readonly github: string;
  readonly linkedin: string;
  readonly youtube: string;
  readonly huggingface: string;
  readonly githubHandle: string;
  readonly repoUrl: string;
}

export const AUTHOR: AuthorInfo = {
  name: 'Youniss',
  role: 'Applied AI Engineer',
  github: 'https://github.com/younissk',
  linkedin: 'https://www.linkedin.com/in/youniss',
  youtube: 'https://www.youtube.com/@youniss-ml',
  huggingface: 'https://huggingface.co/younissk',
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
  { label: 'Projects', href: '/projects/', blurb: 'The complete project archive' },
  { label: 'Library', href: '/library/', blurb: 'Writing, papers and videos' },
  { label: 'Contact', href: '/contact/', blurb: 'Send me a message' },
];

export interface SocialLink {
  readonly label: string;
  readonly href: string;
  /** Displayed handle, e.g. `@younissk`. */
  readonly handle: string;
  /** Key into SocialIcon. Every profile has a mark; none render bare. */
  readonly icon: 'github' | 'linkedin' | 'youtube' | 'huggingface';
}

/**
 * Every profile, in one order, used by every place that shows profiles: the
 * hero, the footer and /contact. Adding one here adds it everywhere, which is
 * the point — they used to drift apart.
 */
export const SOCIALS: readonly SocialLink[] = [
  { label: 'GitHub', href: AUTHOR.github, handle: '@younissk', icon: 'github' },
  { label: 'LinkedIn', href: AUTHOR.linkedin, handle: '/in/youniss', icon: 'linkedin' },
  { label: 'YouTube', href: AUTHOR.youtube, handle: '@youniss-ml', icon: 'youtube' },
  { label: 'Hugging Face', href: AUTHOR.huggingface, handle: '@younissk', icon: 'huggingface' },
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
export const CONTACT_ENDPOINT = 'https://api.web3forms.com/submit';

/**
 * Web3Forms wants the key in a hidden field rather than the URL. Ignored when
 * empty, so Formspree-style endpoints need nothing here.
 *
 * This key is public by design — Web3Forms documents it as safe in client-side
 * code, and it has to ship in the HTML for the form to work at all. It is not a
 * secret and does not belong in Actions secrets.
 */
export const CONTACT_ACCESS_KEY = 'a0a7b927-222f-4cd6-be8e-0cc9addf5d91';
