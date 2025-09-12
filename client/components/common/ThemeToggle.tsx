'use client';

import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored =
      typeof window !== 'undefined' ? (localStorage.getItem('theme') as Theme | null) : null;
    const preferredDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const nextTheme: Theme = stored ?? (preferredDark ? 'dark' : 'light');

    setTheme(nextTheme);

    document.documentElement.setAttribute('data-theme', nextTheme === 'light' ? 'light' : 'dark');

    setMounted(true);
  }, []);

  const handleToggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';

    setTheme(next);

    document.documentElement.setAttribute('data-theme', next === 'light' ? 'light' : 'dark');

    localStorage.setItem('theme', next);
  };

  // Avoid hydration mismatch by rendering a placeholder until mounted
  if (!mounted) {
    return <div className="h-8 w-8 rounded border border-white/10" aria-hidden />;
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={handleToggle}
      className="rounded p-2 hover:bg-white/5 border border-white/10"
      title={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
    >
      {theme === 'light' ? (
        // Moon icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M21.752 15.002A9.718 9.718 0 0 1 12 21.75c-5.385 0-9.75-4.365-9.75-9.75 0-4.28 2.747-7.91 6.594-9.248a.75.75 0 0 1 .93.98A8.25 8.25 0 0 0 20.27 14.07a.75.75 0 0 1 1.482.932z" />
        </svg>
      ) : (
        // Sun icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0 3.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75zm0-20.25a.75.75 0 0 1 .75.75v.75a.75.75 0 1 1-1.5 0V2.25a.75.75 0 0 1 .75-.75zM3.22 5.47a.75.75 0 0 1 1.06 0l.53.53a.75.75 0 1 1-1.06 1.06l-.53-.53a.75.75 0 0 1 0-1.06zm14.16 14.16a.75.75 0 0 1 1.06 0l.53.53a.75.75 0 1 1-1.06 1.06l-.53-.53a.75.75 0 0 1 0-1.06zM.75 12a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5H1.5A.75.75 0 0 1 .75 12zm20.25 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75zM3.22 18.53a.75.75 0 0 1 1.06 0l.53.53a.75.75 0 1 1-1.06 1.06l-.53-.53a.75.75 0 0 1 0-1.06zm14.16-14.16a.75.75 0 0 1 1.06 0l.53.53a.75.75 0 1 1-1.06 1.06l-.53-.53a.75.75 0 0 1 0-1.06z" />
        </svg>
      )}
    </button>
  );
}
