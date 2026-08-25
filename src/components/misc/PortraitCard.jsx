/**
 * A framed portrait with an accent badge clipped to its corner.
 *
 * Monochrome by default so photographs taken in wildly different
 * lighting still sit together as one set — the single most useful
 * thing you can do when the source images weren't art-directed.
 *
 * The badge deliberately overhangs the frame. That overlap is what
 * stops the composition reading as a plain rectangle, and it's why
 * the wrapper can't clip overflow.
 */
export default function PortraitCard({
  src,
  alt,
  badgeTitle,
  badgeSub,
  aspect = "4/5",
  className = "",
}) {
  return (
    <figure className={`relative m-0 ${className}`}>
      <div
        className="overflow-hidden rounded-3xl border border-rule bg-raised"
        style={{ aspectRatio: aspect }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
        />
      </div>

      {badgeTitle && (
        <figcaption className="absolute -bottom-4 right-5 rounded-2xl bg-accent px-5 py-3 text-center shadow-lg">
          {/* Text colour is pinned to the dark ground rather than
              --color-ink, because the badge stays amber in both
              themes and ink inverts. */}
          <p className="font-display text-lg leading-none text-[#141210]">
            {badgeTitle}
          </p>
          {badgeSub && (
            <p className="mt-1 text-[0.625rem] uppercase tracking-[0.16em] text-[#141210]/75">
              {badgeSub}
            </p>
          )}
        </figcaption>
      )}
    </figure>
  );
}
