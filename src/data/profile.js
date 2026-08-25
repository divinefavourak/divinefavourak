/**
 * Identity and contact details.
 *
 * Anything that appears in more than one place (nav, hero, footer,
 * contact page, JSON-LD) lives here so the repositioning only ever
 * has to happen once.
 */

export const profile = {
  name: "Divine-favour Akanbi",
  fullName: "Akanbi Divine-favour Solomon",
  title: "Full-Stack & UX Developer",
  location: "Lagos, Nigeria",
  timezone: "WAT",

  availability: {
    open: true,
    label: "Available for work",
  },

  /** One line, used under the hero. Keep it short — the layout gives it room. */
  tagline:
    "I build products end to end — from the data model to the last pixel.",

  /** Two or three sentences, used on the home page and /about. */
  intro: [
    "I'm a Computer Science student at the University of Lagos who builds across the whole stack — web platforms, mobile apps, and the bots and services that sit behind them.",
    "I care about the seam where engineering meets interface: the part where a system stops being an architecture diagram and starts being something a person can actually use.",
  ],

  education: {
    school: "University of Lagos",
    shortName: "UNILAG",
    programme: "B.Sc. Computer Science (In view)",
    url: "https://unilag.edu.ng",
  },

  email: "divinefavourakanbi07@gmail.com",
  phone: "+2349031843486",

  socials: [
    { label: "GitHub", handle: "@divinefavourak", url: "https://github.com/divinefavourak" },
    { label: "LinkedIn", handle: "Divine-favour Akanbi", url: "https://linkedin.com/in/divine-favour-akanbi-999b5b385/" },
    { label: "X", handle: "@Jesutobi07", url: "https://x.com/jesutobi07" },
    { label: "Instagram", handle: "@theakanbidivine", url: "https://instagram.com/theakanbidivine" },
  ],

  // Served straight from public/. The filename is deliberate — it's
  // what lands in the recruiter's downloads folder.
  resumeUrl: "/Divine-Favour_Solomon_Akanbi-CV.pdf",
  resumeFilename: "Divine-Favour_Solomon_Akanbi-CV.pdf",
  portraitUrl: "/1000934452.jpg",
  siteUrl: "https://akanbi.dev",
};

export default profile;
