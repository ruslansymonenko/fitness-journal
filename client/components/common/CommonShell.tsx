'use client';

import { useI18n } from '@/lib/i18n';
import { useAppStore } from '@/store/store';

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const { errorMessage, setError } = useAppStore();

  return (
    <html suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <script
          // This runs before React hydrates; it sets the theme to avoid FOUC
          dangerouslySetInnerHTML={{
            __html: `(() => {
                try {
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = stored ? stored : (prefersDark ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
                } catch (e) {
                  // If anything fails, default to light to avoid dark flash
                  document.documentElement.setAttribute('data-theme', 'light');
                }
            })();`,
          }}
        />
        <>
          {errorMessage ? (
            <div className="mb-4 rounded-md border border-red-800/40 bg-red-900/30 p-3 text-red-200">
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm">{errorMessage}</span>
                <button
                  onClick={() => setError(null)}
                  className="rounded bg-red-800/40 px-2 py-1 text-xs hover:bg-red-800/60"
                >
                  OK
                </button>
              </div>
            </div>
          ) : null}
          {children}
        </>
      </body>
    </html>
  );
}
