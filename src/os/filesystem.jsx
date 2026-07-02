import { DevAbout, DevStack, DevLogs, DevProjects, devProjectCount } from "./devContent.jsx";
import { LeaderProfile, LeaderRoles, leaderRoleCount } from "./leaderContent.jsx";

/* ============================================================
   AKANBI.OS FILESYSTEM
   Single source of truth for both drives. The Explorer, sidebar
   tree, taskbar, and desktop icons all render from this object.

   A node:
     id       — filename, also the URL segment (/dev/about.txt)
     icon     — glyph shown in listings
     kind     — 'file' | 'dir' (display only; dirs open the same way)
     type     — "Type" column text in the listing
     size     — "Size" column text
     render   — component rendered when the node is opened
   ============================================================ */

export const DRIVES = {
  dev: {
    key: "dev",
    letter: "C",
    label: "DEV",
    route: "/dev",
    accentVar: "--blue",
    accentText: "var(--black)",
    tagline: "code, projects & stack",
    children: [
      { id: "about.txt",   icon: "📄", kind: "file", type: "Text Document",  size: "3 KB",  render: DevAbout },
      { id: "stack.sys",   icon: "⚙️", kind: "file", type: "System File",    size: "19 pkgs", render: DevStack },
      { id: "history.log", icon: "📜", kind: "file", type: "Log File",       size: "2021–now", render: DevLogs },
      { id: "projects",    icon: "📁", kind: "dir",  type: "File Folder",    size: `${devProjectCount} items`, render: DevProjects },
    ],
  },

  leadership: {
    key: "leadership",
    letter: "D",
    label: "LEADER",
    route: "/leadership",
    accentVar: "--coral",
    accentText: "var(--white)",
    tagline: "faith, service & people",
    children: [
      { id: "profile.txt", icon: "👑", kind: "file", type: "Text Document", size: "2 KB", render: LeaderProfile },
      { id: "roles",       icon: "📁", kind: "dir",  type: "File Folder",   size: `${leaderRoleCount} items`, render: LeaderRoles },
    ],
  },
};

/** The drive that is NOT the one passed in — powers the C:\ ⇄ D:\ switch. */
export function otherDrive(driveKey) {
  return driveKey === "dev" ? DRIVES.leadership : DRIVES.dev;
}

/** Full OS-style path string, e.g. "C:\DEV\PROJECTS\" */
export function drivePath(drive, nodeId) {
  const base = `${drive.letter}:\\${drive.label}\\`;
  return nodeId ? `${base}${nodeId.toUpperCase()}` : base;
}
