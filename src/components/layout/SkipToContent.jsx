/**
 * Keyboard skip link.
 *
 * Visually hidden until focused, then pinned to the top-left. The
 * previous version styled itself with a `.skip-to-content` class
 * from the legacy stylesheet, which is now scoped under .os-root —
 * so it is restyled here with utilities instead.
 */
export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-ink focus:bg-paper focus:px-4 focus:py-2 focus:text-sm"
    >
      Skip to main content
    </a>
  );
}
