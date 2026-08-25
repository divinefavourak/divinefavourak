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

  // The effect is keyed on this counter, NOT on `status`.
  //
  // Keying it on status is the obvious-looking version and it's
  // broken: the effect itself sets status to "playing", which
  // changes a dependency, so React tears the effect down and the
  // cleanup destroys the engine in the same tick it was created.
  // The game starts and dies instantly. A counter that only changes
  // when the visitor presses Play keeps the effect stable for the
  // whole life of a run.
  const [runId, setRunId] = useState(0);

  const start = useCallback(() => {
    setStatus("loading");
    setRunId((n) => n + 1);
  }, []);

  useEffect(() => {
    if (runId === 0) return;

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

        if (cancelled) return;
        if (!canvasRef.current) {
          // Mounted but no canvas: without resetting, status stays
          // "loading" forever and the Play button is left disabled
          // reading "Loading…" with no way to retry.
          setStatus("error");
          return;
        }

        instance = createGame(canvasRef.current);
        setStatus("playing");
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
  }, [runId, game]);

  const isRunning = status === "playing";

  // Focus only once the canvas is actually focusable.
  //
  // Focusing straight after createGame() did nothing: React 18 does
  // not flush the "playing" state synchronously inside an async
  // continuation, so at that moment the canvas still carried
  // tabIndex={-1} and visibility:hidden — and a hidden element
  // cannot take focus. The engines bind their keydown handlers to
  // the canvas, so Escape-to-pause and Jollof's name entry were dead
  // until the visitor clicked it.
  useEffect(() => {
    if (!isRunning) return;
    canvasRef.current?.focus({ preventScroll: true });
  }, [isRunning]);

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
