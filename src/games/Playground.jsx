import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import GameCanvas from "./GameCanvas.jsx";
import Reveal from "../components/motion/Reveal.jsx";
import { games } from "../data/games.js";
import { EASE } from "../components/motion/motion.js";

/**
 * The playground section.
 *
 * One game is mounted at a time. Switching tabs unmounts the
 * previous GameCanvas entirely, which runs its engine's destroy()
 * — so two rAF loops can never be live at once regardless of how
 * much the visitor clicks around.
 *
 * The `key` on GameCanvas is what forces that remount; without it
 * React would reuse the component instance and hand the running
 * engine a different game's config.
 */
export default function Playground() {
  const [activeSlug, setActiveSlug] = useState(games[0].slug);
  const reduced = useReducedMotion();
  const active = games.find((g) => g.slug === activeSlug) ?? games[0];

  return (
    <div>
      <Reveal>
        {/* Tabs. Games are self-contained builds, so the switch is
            a genuine tablist rather than decorative chrome. */}
        <div
          role="tablist"
          aria-label="Choose a game"
          className="flex flex-wrap gap-x-2 gap-y-2 border-b border-rule pb-4"
        >
          {games.map((game) => {
            const isActive = game.slug === activeSlug;
            return (
              <button
                key={game.slug}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={`game-panel-${game.slug}`}
                onClick={() => setActiveSlug(game.slug)}
                className="relative px-3 py-2 text-sm transition-colors"
                style={{ color: isActive ? undefined : "var(--color-muted)" }}
              >
                {game.title}
                {isActive && (
                  <motion.span
                    layoutId={reduced ? undefined : "game-tab"}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="absolute inset-x-3 -bottom-4 h-px bg-ink"
                  />
                )}
              </button>
            );
          })}
        </div>
      </Reveal>

      <Reveal
        key={active.slug}
        className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-12"
        id={`game-panel-${active.slug}`}
        role="tabpanel"
      >
        <div className="lg:col-span-4">
          <p className="label">{active.year}</p>
          <h3 className="mt-3 text-2xl sm:text-3xl">{active.title}</h3>
          <p className="mt-1.5 text-sm text-muted">{active.subtitle}</p>
          <p className="mt-5 max-w-prose text-sm leading-relaxed text-muted">
            {active.blurb}
          </p>
          <p className="mt-5 text-xs leading-relaxed text-faint">
            Written as a single HTML file with the Canvas API and no
            game engine. Ported here so it runs inside the page.
          </p>
        </div>

        <div className="lg:col-span-8">
          <GameCanvas key={active.slug} game={active} />
        </div>
      </Reveal>
    </div>
  );
}
