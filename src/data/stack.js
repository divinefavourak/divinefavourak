/**
 * Technology stack, grouped by domain.
 *
 * Grouping (rather than the flat tag cloud the old site used) is
 * what actually communicates full-stack range — a single list of
 * nineteen logos reads as "knows some tools", whereas five labelled
 * columns read as "works at every layer".
 *
 * Icons are shared with the C:\DEV drive in /os.
 */

import {
  SiJavascript, SiTypescript, SiPython, SiC,
  SiReact, SiNodedotjs, SiExpress, SiDjango,
  SiHtml5, SiCss3, SiTailwindcss,
  SiExpo, SiFigma,
  SiMongodb, SiPostgresql,
  SiVite, SiGithub, SiDocker, SiVercel, SiGooglecloud,
} from "react-icons/si";

export const stackGroups = [
  {
    name: "Languages",
    items: [
      { name: "JavaScript", Icon: SiJavascript },
      { name: "TypeScript", Icon: SiTypescript },
      { name: "Python", Icon: SiPython },
      { name: "C", Icon: SiC },
    ],
  },
  {
    name: "Frontend",
    items: [
      { name: "React", Icon: SiReact },
      { name: "HTML5", Icon: SiHtml5 },
      { name: "CSS3", Icon: SiCss3 },
      { name: "Tailwind CSS", Icon: SiTailwindcss },
      { name: "Vite", Icon: SiVite },
    ],
  },
  {
    name: "Backend",
    items: [
      { name: "Node.js", Icon: SiNodedotjs },
      { name: "Express", Icon: SiExpress },
      { name: "Django", Icon: SiDjango },
    ],
  },
  {
    name: "Mobile",
    items: [
      { name: "React Native", Icon: SiReact },
      { name: "Expo", Icon: SiExpo },
    ],
  },
  {
    name: "Data & Infra",
    items: [
      { name: "PostgreSQL", Icon: SiPostgresql },
      { name: "MongoDB", Icon: SiMongodb },
      { name: "Docker", Icon: SiDocker },
      { name: "Vercel", Icon: SiVercel },
      { name: "Google Cloud", Icon: SiGooglecloud },
      { name: "Git / GitHub", Icon: SiGithub },
    ],
  },
  {
    name: "Design",
    items: [{ name: "Figma", Icon: SiFigma }],
  },
];

/** Flat list, for the /os drive listing and the stack.sys package count. */
export const stackItems = stackGroups.flatMap((g) => g.items);

export default stackGroups;
