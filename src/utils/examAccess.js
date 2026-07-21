import { useEffect, useState } from "react";

/** Login button/page stays visible for exactly 24h from when this was added. */
export const EXAM_LOGIN_EXPIRES_AT = new Date("2026-07-22T21:15:44Z").getTime();

export function isExamLoginOpen() {
  return Date.now() < EXAM_LOGIN_EXPIRES_AT;
}

/** React hook: true until the 24h window elapses, then flips to false — even if the tab stays open. */
export function useExamLoginOpen() {
  const [open, setOpen] = useState(isExamLoginOpen());

  useEffect(() => {
    if (!open) return;
    const remaining = EXAM_LOGIN_EXPIRES_AT - Date.now();
    const timer = setTimeout(() => setOpen(false), Math.max(remaining, 0));
    return () => clearTimeout(timer);
  }, [open]);

  return open;
}
