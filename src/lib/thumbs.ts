/**
 * A picture for every row.
 *
 * Videos have real thumbnails in public/thumbs/. Everything else — posts,
 * papers, projects — already has a generated social card in public/og/, named
 * after its route with the slashes turned into hyphens. Those cards are on
 * brand, already committed, and were only ever being handed to scrapers.
 * Reusing them means a list of mixed content has an image on every line
 * instead of a hole wherever the content is not a video.
 *
 * Resolved against the real directory at build time, so a route with no card
 * gets `null` and the caller draws a placeholder rather than a broken image.
 */
const OG_FILES = new Set(
  Object.keys(import.meta.glob('/public/og/*.png')).map(
    (path) => path.split('/').pop() as string,
  ),
);

/** `/papers/x/` → `/og/papers-x.png`, when that card exists. */
export function cardFor(href: string): string | null {
  const route = href.replace(/^\/+|\/+$/g, '');
  const name = route === '' ? 'index' : route.replace(/\//g, '-');
  return OG_FILES.has(`${name}.png`) ? `/og/${name}.png` : null;
}
