# Fonts

`Inter-400.ttf` and `Inter-700.ttf` — Inter, by Rasmus Andersson, licensed under
the SIL Open Font License 1.1. The same typeface the site itself sets text in.

They are committed on purpose. `scripts/generate-og.ts` loads them from disk, so
`npm run og` never touches the network and never depends on a font being
installed on whichever machine runs it. A card generated in five years looks
like a card generated today.

Only these two weights exist here, which is why the Open Graph cards set their
eyebrow and footer in tracked-out uppercase Inter rather than the monospace the
site uses for metadata. Adding a monospace face is allowed — drop the `.ttf`
here, register it in the `fonts` array in `scripts/generate-og.ts`, and note its
licence in this file.
