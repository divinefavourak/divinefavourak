/**
 * Project catalogue — the single source of truth for the work rows,
 * the /work/:slug case studies, and the C:\DEV drive inside /os.
 *
 * ── Filling in links ────────────────────────────────────────────
 * `TODO_LINK` marks a URL that hasn't been supplied yet. Rows and
 * case studies check with `hasLink()` and simply omit the button
 * rather than rendering a dead href, so the site is shippable with
 * gaps. Replace the sentinel with a real URL to light the link up.
 *
 * ── Schema ──────────────────────────────────────────────────────
 *   slug      URL segment for /work/:slug
 *   title     display name
 *   year      free text, e.g. "2025 — present"
 *   category  Full-Stack | Mobile | Platform | Design
 *   summary   ONE line; shown on the work row
 *   role      what you actually did
 *   stack     array of technologies
 *   metrics   [{ label, value }] shown in the metadata grid
 *   image     screenshot path, or null — see below
 *   links     { live, repo, ...extras }
 *   featured  surfaces on the home page
 *   caseStudy null, or the long-form content for /work/:slug
 *
 * ── Project images ──────────────────────────────────────────────
 * `image: null` makes the card fall back to a live preview of
 * `links.live`, framed and scaled down (see ProjectPreview.jsx).
 * That keeps every deployed project looking current with no assets
 * to maintain, but it costs a network request per card and breaks
 * for any host that refuses to be framed.
 *
 * Real screenshots are better. Drop a 1200x750 (16:10) PNG or JPG
 * into public/work/ and point `image` at it:
 *
 *     image: "/work/acadmate.png",
 *
 * A project with no image AND no live URL falls back to a
 * typographic plate, so nothing ever renders empty.
 */

/** Sentinel for a URL the user hasn't supplied yet. */
export const TODO_LINK = null;

/** True when a link is a real, renderable URL. */
export function hasLink(url) {
  return typeof url === "string" && url.length > 0 && url !== "#";
}

export const projects = [
  {
    slug: "acadmate",
    title: "AcadMate",
    year: "2025 — present",
    category: "Full-Stack",
    status: "live",
    summary:
      "Co-founded e-learning platform preparing Nigerian candidates for JAMB and Post-UTME.",
    role: "Co-founder · Full-Stack",
    stack: ["React", "Node.js", "Express", "PostgreSQL", "Vercel"],
    metrics: [
      { label: "Audience", value: "JAMB / Post-UTME candidates" },
      { label: "Role", value: "Co-founder" },
      { label: "Status", value: "Live" },
    ],
    image: null,

    links: {
      live: "https://acadmate.com.ng",
      repo: TODO_LINK,
    },
    featured: true,
    // ⚠️ DRAFT COPY — VERIFY BEFORE PUBLISHING.
    // Written from the one-line brief ("co-founded e-learning platform for
    // JAMB/Post-UTME candidates") to demonstrate the case-study layout with
    // realistic content. The narrative describes plausible features, not
    // confirmed ones. Correct anything AcadMate doesn't actually do.
    caseStudy: {
      context:
        "Every year, well over a million Nigerian students sit JAMB and Post-UTME. Preparation material is abundant but scattered — PDFs passed around on WhatsApp, past questions of unknown provenance, and tutorial centres that price out the students who need them most.",
      problem:
        "The gap isn't content, it's structure. A candidate can find a thousand past questions and still have no idea which topics they are actually weak in, or whether the answers they're studying are correct. What was missing was a system that turned scattered material into a measurable study loop.",
      approach: [
        "Built a structured question bank organised by subject, topic and exam year, so practice can be targeted rather than random.",
        "Added timed mock exams that mirror the real JAMB format and constraints, so the first time a candidate feels exam pressure isn't on exam day.",
        "Instrumented every attempt to produce per-topic performance breakdowns, turning a raw score into a specific list of what to revise next.",
        "Kept the interface deliberately light, because a meaningful share of the audience is on low-end Android devices and metered data.",
      ],
      architecture:
        "A React front end talking to an Express API over REST, with PostgreSQL as the store — relational because the core queries are inherently relational: questions belong to topics, attempts belong to users, and the analytics are aggregations across both. Deployed on Vercel.",
      outcome:
        "AcadMate is live at acadmate.com.ng and in active use. As a co-founder I own the technical direction alongside building the product itself.",
      screens: [],
    },
  },

  {
    slug: "rccg-r63-teens",
    title: "Faith Tribe — RCCG Region 63 Teens",
    year: "2025 — present",
    category: "Full-Stack",
    status: "production",
    summary:
      "Started as the registration site for a regional teens' camp; rebuilt into a discipleship platform with a daily devotional, a Bible and event tools for leaders.",
    role: "Project Lead · Full-Stack",
    stack: ["Django", "PostgreSQL", "Redis", "React", "TypeScript", "Expo", "Squad"],
    metrics: [
      { label: "Largest event", value: "443 registrations" },
      { label: "Clients", value: "Website · Console · Android + web app" },
      { label: "Payments", value: "Bank transfer, now Squad" },
    ],
    image: null,

    links: {
      live: "https://thefaithtribe.live/",
      repo: "https://github.com/divinefavourak/rccg-r63-teens" ,
    },
    featured: true,
    caseStudy: {
      context:
        "Faith Tribe is the teens' church of RCCG Region 63, spread across provinces, zones and parishes in Lagos. The project began in November 2025 as the site for the region's December camp, The Priceless Gift: a countdown, an Advent calendar, and registration. I built that first version with two other developers in under four weeks, before the camp opened on 22 December.",
      problem:
        "The camp site did its job, but it was an event system with church features bolted on afterwards. Provinces were a hard-coded list of Lagos provinces, permissions were a flat admin check, and one permission trusted a province sent by the client, an open path to another province's data. There was no Bible and no reason for a teen to open it between events. Fixing that meant rebuilding the core while production was live, with 34 users and an event of 443 registrations that couldn't be lost.",
      approach: [
        "For the camp, built coordinator registration: each province's coordinator registered their teens in bulk, paid by bank transfer and uploaded proof, an admin verified it, and every teen was emailed a QR ticket.",
        "Audited the backend against the product documents in July 2026, then rebuilt access around the church as a tree: Parish, Area, Zone, Province, Region, National. A role is held at one place in the tree and reaches only what sits beneath it, which closed the cross-province hole. The upgrade was rehearsed against a copy of production before it ran on the live database.",
        "Built the daily product: the devotional imported each day from RCCG's site, its memory verse as the Verse of the Day and its Action Point as the day's challenge; a Bible with search that can be kept whole on the phone; streaks with grace days; and a reminder ladder that stops once the devotional is read.",
        "Built the app in Expo from the Figma designs, for Android and as a web app iPhone users install from Safari. Teachers get their class list and a QR scanner for the door that saves scans on the phone when the signal drops.",
        "Reworked events for self-service: Squad checkout, a short pay link a teen can send a parent, a place confirmed by payment and released if it isn't paid by the deadline, automatic bedspace allocation, and a leaders' Console with CSV and PDF exports.",
      ],
      architecture:
        "One Django REST API, on PostgreSQL and Redis, serves the React and TypeScript website with its Console and the Expo app, which builds both the Android app and the iPhone web app. Event capacity, bedspaces and payments lock the rows they change, so two people can't take the last place at once, and a payment can complete a registration only once. Squad webhooks are verified with HMAC-SHA512. There is no paid background worker: an outside timer calls a secured endpoint every five minutes and the API runs whatever is due, safe to repeat. The API is on Render, the web front ends on Vercel, and Android builds come from Expo EAS and are served from R2.",
      outcome:
        "Camp registration ran through the first version. The rebuilt platform is live at thefaithtribe.live, with the app released in October 2026 as an Android download and an iPhone web app. The backend has close to 500 tests. A written performance and concurrency audit records what has been fixed and what is still open, and the door scanner and live Squad payments are still being proven on real devices.",
      screens: [],
    },
  },

   {
    slug: "siwes-companion",
    title: "SIWES Companion",
    year: "2026",
    category: "Full-Stack",
    status: "production",
    summary:
      "A web app and Telegram bot that turn daily SIWES notes into grounded logbook entries students can defend.",
    role: "Solo Developer",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "grammY", "Groq", "Docker"],
    metrics: [
      { label: "Platform", value: "Web + Telegram" },
      { label: "AI", value: "Llama 3.3 70B via Groq" },
      { label: "Hosting", value: "Self-hosted 2 GB VPS" },
    ],
    image: null,

    links: {
      live: "https://swcompanion.akanbi.dev/",
      repo: "https://github.com/divinefavourak/siwes-companion",
    },
    featured: true,
    caseStudy: {
      context:
        "SIWES is the industrial training placement Nigerian STEM students complete before graduating. Each one has to keep a daily logbook, write a report from it, and then defend the work in front of supervisors.",
      problem:
        "Students put the logbook off, lose track of what they did between workdays, and end up writing entries weeks later from memory. Generic AI tools make this worse: they will happily produce polished entries describing work that never happened, which collapses the moment an examiner asks a follow-up question. The goal was a record that is easy to keep and honest enough to defend.",
      approach: [
        "Made capture fit into a workday: students message a Telegram bot in plain language, with no commands to remember, or use the web studio. The bot updates a single live message per flow, so the chat doesn't fill up with replies.",
        "Kept the AI to rewriting, never inventing. Llama 3.3 70B on Groq turns a rough note into a formal past-tense entry at temperature 0.1, and a separate check flags any tool, project or achievement the student never mentioned. It also catches an observation being upgraded into a responsibility, like 'watched' becoming 'configured'.",
        "Stored the raw note, the AI draft and the student's edit as separate records, so the original is never overwritten and the student owns every saved word.",
        "Built habit features around missed days: logging streaks, an activity heatmap, a weekly catch-up reminder that lists unlogged working days, and a history view for back-filling past weeks.",
        "Added logbook PDF export, plus kanban boards for tracking personal projects and lab work alongside the placement.",
      ],
      architecture:
        "A Next.js 15 App Router app in TypeScript, with a shared domain core so the web studio and the grammY Telegram adapter call the same services. PostgreSQL through Prisma, Auth.js credentials with scrypt-hashed passwords, and an AI provider layer that uses Groq first, falls back to Anthropic, and drops to a deterministic fake provider in tests. The Telegram webhook checks a secret token with a constant-time compare and ignores duplicate updates. It runs in Docker on a 2 GB VPS behind a Cloudflare Tunnel, with images built in GitHub Actions because building on the box ran it out of memory.",
      outcome:
        "Live at swcompanion.akanbi.dev with daily capture on web and Telegram, review and editing, history, streaks, catch-up reminders and PDF export. An evidence vault, a report compiler and an oral-defence simulator that asks questions drawn from the student's own entries are next; their data models are already in place.",
      screens: [],
    },
  },
  
  {
    slug: "fitness-tracker",
    title: "Fitness Tracker",
    year: "2025",
    category: "Mobile",
    status: "in development",
    summary:
      "React Native app tracking steps, walks and runs, with a community layer for shared challenges.",
    role: "Mobile Developer",
    stack: ["React Native", "Expo", "TypeScript"],
    metrics: [
      { label: "Platform", value: "iOS / Android" },
      { label: "Focus", value: "Activity tracking · Community" },
    ],
    image: null,

    links: {
      live: TODO_LINK,
      repo: TODO_LINK,
    },
    featured: true,
    caseStudy: null,
  },

  {
    slug: "bot-ecosystem",
    title: "Multi-Platform Bot Ecosystem",
    year: "2024 — present",
    category: "Platform",
    status: "online",
    summary:
      "Three conversational bots across WhatsApp, Slack and Telegram, sharing one service architecture.",
    role: "Backend Engineer",
    stack: ["Node.js", "Express", "MongoDB", "Gemini", "Docker"],
    metrics: [
      { label: "Surfaces", value: "WhatsApp · Slack · Telegram" },
      { label: "Pattern", value: "Multi-session, crash-resilient" },
    ],
    image: null,
    // ⚠️ jesutobi-bot.onrender.com currently returns "This service
    // has been suspended by its owner", so the live frame renders a
    // blank white panel. Forced to the typographic plate until the
    // host is back (or a screenshot is added above).
    preview: "plate",
    links: {
      live: "https://jesutobi-bot.onrender.com/",
      repo: TODO_LINK,
    },
    featured: true,
    caseStudy: null,
    /** Sub-projects, rendered as a nested list on the row. */
    parts: [
      {
        name: "Jesutobi — WhatsApp",
        note: "Multi-session bot with AI integration, MongoDB-backed auth, an admin dashboard and crash-resilient session handling.",
      },
      {
        name: "Slack bot",
        note: "Custom workspace bot for team workflows and automation.",
      },
      {
        name: "Telegram academic helper",
        note: "AI-integrated assistant answering coursework questions for students.",
      },
    ],
  },

  {
    slug: "crash-course",
    title: "University Crash Course Platform",
    year: "2025",
    category: "Platform",
    status: "live",
    summary:
      "Accessible web platform hosting intensive study material for university coursework.",
    role: "Full-Stack Developer",
    stack: ["React", "Vite", "Tailwind CSS"],
    metrics: [
      { label: "Audience", value: "University students" },
      { label: "Focus", value: "Accessibility · Speed" },
    ],
    image: null,

    links: {
      live: "https://202s.netlify.app/",
      repo: "https://github.com/divinefavourak/crash-course",
    },
    featured: true,
    caseStudy: null,
  },



  {
    slug: "attendance-system",
    title: "Attendance System",
    year: "2025",
    category: "Design",
    status: "shipped",
    summary:
      "UI/UX and branding for an automated attendance tracker, built collaboratively.",
    role: "UI/UX & Branding",
    stack: ["Figma", "Design System", "Branding"],
    metrics: [
      { label: "Contribution", value: "Interface & identity" },
      { label: "Team", value: "Collaborative" },
    ],
    image: null,

    links: {
      live: "https://atp-go.vercel.app/",
      repo: TODO_LINK,
      figma: TODO_LINK,
    },
    featured: false,
    caseStudy: null,
  },

  {
    slug: "eduguard-ai",
    title: "EduGuard AI",
    year: "2024",
    category: "Full-Stack",
    status: "beta",
    summary:
      "Academic fraud detection platform for institutions, with integrated AI analysis.",
    role: "Frontend & Integration",
    stack: ["React", "Vite", "AI"],
    metrics: [{ label: "Domain", value: "Academic integrity" }],
    image: null,

    links: {
      live: "https://edu-guard-ai.vercel.app/",
      repo: "https://github.com/divinefavourak/edu-guard-ai",
    },
    featured: false,
    caseStudy: null,
  },

  {
    slug: "recipe-book",
    title: "Recipe Book",
    year: "2023",
    category: "Full-Stack",
    status: "stable",
    summary:
      "Recipe search engine built with vanilla JavaScript against a REST API.",
    role: "Frontend Developer",
    stack: ["JavaScript", "REST API", "HTML/CSS"],
    metrics: [{ label: "Built with", value: "No framework" }],
    image: null,

    links: {
      live: "https://divinefavourak.github.io/recipe-book/",
      repo: "https://github.com/divinefavourak/recipe-book",
    },
    featured: false,
    caseStudy: null,
  },
];

/** Home page rows. */
export const featuredProjects = projects.filter((p) => p.featured);

/** Lookup for /work/:slug. */
export function getProject(slug) {
  return projects.find((p) => p.slug === slug) ?? null;
}

/** Projects that have long-form content and therefore a real page. */
export const caseStudies = projects.filter((p) => p.caseStudy);

/**
 * Previous/next navigation at the foot of a case study. Wraps around,
 * and only ever points at slugs that actually have a page.
 */
export function adjacentCaseStudies(slug) {
  const i = caseStudies.findIndex((p) => p.slug === slug);
  if (i === -1 || caseStudies.length < 2) return { prev: null, next: null };
  return {
    prev: caseStudies[(i - 1 + caseStudies.length) % caseStudies.length],
    next: caseStudies[(i + 1) % caseStudies.length],
  };
}

export default projects;
