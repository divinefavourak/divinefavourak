/**
 * Leadership roles — student government and church service.
 *
 * `TODO_DATE` marks a tenure the user hasn't supplied yet; the UI
 * omits the date rather than guessing.
 */

export const TODO_DATE = null;

export const roles = [
  {
    title: "Public Relations Officer",
    org: "Faculty of Computing and Informatics (FOCI / CISA)",
    orgShort: "FOCI / CISA",
    period: TODO_DATE,
    current: true,
    kind: "Student leadership",
    logo: null,
    description:
      "Public Relations Officer for the Faculty of Computing and Informatics Students' Association — owning faculty communications, managing the association's public voice, and coordinating outreach across the student body.",
    link: null,
  },
  {
    title: "Regional Teens President",
    org: "Region 63 Junior Church — RCCG",
    orgShort: "RCCG R63",
    period: TODO_DATE,
    current: true,
    kind: "Church leadership",
    logo: "/logos/rccg.png",
    logoAlt: "RCCG logo",
    description:
      "Responsible for the spiritual development, pastoral care and welfare of teenagers across the region — organising events, overseeing regional activities, and mentoring teen leaders.",
    link: "https://rccg.org",
  },
  {
    title: "National Teens Vice President",
    org: "RCCG DTCE — Lagos Zone 5",
    orgShort: "RCCG DTCE",
    period: TODO_DATE,
    current: true,
    kind: "Church leadership",
    logo: "/logos/dtce.png",
    logoAlt: "RCCG DTCE logo",
    description:
      "Serving on the National Teens Board for Lagos Zone 5 under RCCG's Directorate of Teens and Children Education — overseeing teen leadership programmes, driving zone-wide strategy, and coordinating outreach initiatives.",
    link: null,
  },
];

export default roles;
