import { useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

const getInitialTheme = (): Theme => {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

type StartViewTransition = (cb: () => void) => { ready: Promise<void> };

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* noop */
    }

    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#0f0f0f" : "#0a0a0a";
  }, [theme]);

  const applyTheme = useCallback(
    (next: Theme, origin?: { x: number; y: number }) => {
      const doc = document as Document & {
        startViewTransition?: StartViewTransition;
      };

      if (!doc.startViewTransition || prefersReducedMotion()) {
        setThemeState(next);
        return;
      }

      const root = document.documentElement;
      const { x, y } =
        origin ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      root.style.setProperty("--vt-origin-x", `${x}px`);
      root.style.setProperty("--vt-origin-y", `${y}px`);
      root.style.setProperty("--vt-end-radius", `${endRadius}px`);
      root.dataset.themeTransition = next;

      const transition = doc.startViewTransition(() => {
        setThemeState(next);
      });

      transition.ready.finally(() => {
        // cleanup deferred to after animation via CSS; no-op here
      });

      // Clean up the attribute once the transition finishes so subsequent
      // layout changes don't reuse stale view-transition rules.
      Promise.resolve(transition.ready)
        .catch(() => {})
        .finally(() => {
          // finished is not in older type defs — read defensively
          const finished = (transition as unknown as { finished?: Promise<void> })
            .finished;
          (finished ?? Promise.resolve()).finally(() => {
            delete root.dataset.themeTransition;
          });
        });
    },
    [],
  );

  const setTheme = useCallback(
    (next: Theme, origin?: { x: number; y: number }) => applyTheme(next, origin),
    [applyTheme],
  );

  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      const current = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
      const next: Theme = current === "dark" ? "light" : "dark";
      applyTheme(next, origin);
    },
    [applyTheme],
  );

  return { theme, setTheme, toggle };
};

export type { Theme };
