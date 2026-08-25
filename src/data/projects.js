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
    title: "RCCG R63 Teens",
    year: "2025",
    category: "Full-Stack",
    status: "production",
    summary:
      "Event management system with registration, ticketing, payments, QR check-in and approval workflows.",
    role: "Full-Stack Developer",
    stack: ["Django", "React", "PostgreSQL", "Paystack"],
    metrics: [
      { label: "Payments", value: "Paystack" },
      { label: "Check-in", value: "QR-based" },
    ],
    image: null,

    links: {
      live: "https://thefaithtribe.live/",
      repo: "https://github.com/divinefavourak/rccg-r63-teens" ,
    },
    featured: true,
    caseStudy: null,
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
