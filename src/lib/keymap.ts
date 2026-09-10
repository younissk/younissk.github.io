/**
 * The vim keymap, defined once.
 *
 * Both the behaviour and the cheat sheet read from this, so a shortcut cannot
 * be documented without working or work without being documented — which is
 * the usual way these things rot.
 */

export interface KeyBinding {
  /** What the reader presses. Each string renders as its own <kbd>. */
  keys: string[];
  label: string;
  /** Internal route for a jump binding. Absent for the motions. */
  href?: string;
}

export interface KeyGroup {
  title: string;
  bindings: KeyBinding[];
}

export const KEYMAP: KeyGroup[] = [
  {
    title: 'Go to',
    bindings: [
      { keys: ['g', 'h'], label: 'Home', href: '/' },
      { keys: ['g', 'p'], label: 'Projects', href: '/projects/' },
      { keys: ['g', 'l'], label: 'Library', href: '/library/' },
      { keys: ['g', 'w'], label: 'Writing', href: '/writing/' },
      { keys: ['g', 'r'], label: 'Research papers', href: '/papers/' },
      { keys: ['g', 'v'], label: 'Videos', href: '/videos/' },
      { keys: ['g', 'n'], label: 'Now', href: '/now/' },
      { keys: ['g', 'u'], label: 'Uses', href: '/uses/' },
      { keys: ['g', 'c'], label: 'Contact', href: '/contact/' },
    ],
  },
  {
    title: 'Move',
    bindings: [
      { keys: ['j'], label: 'Next item' },
      { keys: ['k'], label: 'Previous item' },
      { keys: ['g', 'g'], label: 'Top of page' },
      { keys: ['G'], label: 'Bottom of page' },
      { keys: ['↵'], label: 'Open the focused item' },
    ],
  },
  {
    title: 'Everything else',
    bindings: [
      { keys: ['/'], label: 'Search' },
      { keys: ['⌘', 'K'], label: 'Search, the other way' },
      { keys: ['?'], label: 'This list' },
      { keys: ['esc'], label: 'Close' },
    ],
  },
];

/** Flattened `g`-prefixed jumps, for the runtime. */
export const JUMPS: Record<string, string> = Object.fromEntries(
  KEYMAP.flatMap((group) => group.bindings)
    .filter((b) => b.href && b.keys[0] === 'g' && b.keys.length === 2)
    .map((b) => [b.keys[1], b.href as string]),
);
