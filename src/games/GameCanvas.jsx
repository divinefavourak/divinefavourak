import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Mounts a canvas game engine and owns its lifecycle.
 *
 * The engines are imperative: module-scope state, listeners, and a
 * requestAnimationFrame loop. Porting that into React state would be
 * the wrong move — these mutate ~60 times a second, and React state
 * exists to trigger renders, which is precisely what a canvas does
 * not need. So React owns only mounting and teardown; the engine
 * owns the pixels.
 *
 * Nothing loads until the visitor presses Play, so an unplayed game
 * costs one poster frame and no JavaScript.
 */
export default function GameCanvas({ game }) {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | loading | playing | error

  const start = useCallback(() => {
    setStatus((s) => (s === "idle" || s === "error" ? "loading" : s));
  }, []);

  useEffect(() => {
    if (status !== "loading") return;

    // `cancelled` guards the async gap: React 18 StrictMode mounts,
    // unmounts and remounts effects in development, so this effect
    // can be torn down while the dynamic import is still in flight.
    // Without the guard we'd create an engine nobody can destroy.
    let cancelled = false;
    let instance = null;

    (async () => {
      try {
        const [{ createGame }, { ensureGameFonts }] = await Promise.all([
          game.load(),
          import("./gameFonts.js"),
        ]);
        await ensureGameFonts();

        if (cancelled || !canvasRef.current) return;

        instance = createGame(canvasRef.current);
        setStatus("playing");
        // Focus so the engine's keydown handlers (pause, name entry)
        // receive keys without the visitor having to click first.
        canvasRef.current.focus({ preventScroll: true });
      } catch (err) {
        if (cancelled) return;
        console.error(`[${game.slug}] failed to start:`, err);
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      instance?.destroy();
    };
  }, [status, game]);

  const isRunning = status === "playing";

  return (
    <figure className="m-0">
      <div
        className="relative w-full overflow-hidden border border-rule bg-ink"
        style={{ aspectRatio: `${game.width} / ${game.height}` }}
      >
        <canvas
          ref={canvasRef}
          width={game.width}
          height={game.height}
          tabIndex={isRunning ? 0 : -1}
          aria-label={`${game.title} — playable canvas game. ${game.controls}.`}
          className="block h-full w-full"
          style={{
            cursor: isRunning ? "crosshair" : "default",
            imageRendering: "pixelated",
            // Hidden rather than unmounted: the ref must exist when
            // the engine initialises.
            visibility: isRunning ? "visible" : "hidden",
          }}
        />

        {!isRunning && (
          <div className="absolute inset-0 grid place-items-center bg-ink px-6 text-center">
            <div>
              <p
                className="font-display text-4xl leading-none sm:text-5xl"
                style={{ color: game.accent }}
              >
                {game.title}
              </p>
              <p className="label mt-3 text-faint">{game.subtitle}</p>

              {status === "error" ? (
                <>
                  <p className="mt-6 max-w-sm text-sm text-paper/70">
                    This game failed to load. Refreshing the page usually
                    sorts it.
                  </p>
                  <button
                    type="button"
                    onClick={start}
                    className="mt-4 border border-paper/30 px-6 py-2 text-sm text-paper transition-colors hover:bg-paper hover:text-ink"
                  >
                    Try again
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={start}
                  disabled={status === "loading"}
                  className="mt-6 border border-paper/30 px-8 py-2.5 text-sm tracking-wide text-paper transition-colors hover:bg-paper hover:text-ink disabled:opacity-50"
                >
                  {status === "loading" ? "Loading…" : "Play"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <figcaption className="label mt-3 block">{game.controls}</figcaption>
    </figure>
  );
}
