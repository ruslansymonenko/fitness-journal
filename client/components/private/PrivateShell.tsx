'use client';

import { useI18n } from '@/lib/i18n';
import Sidebar from '@/components/private/Sidebar';
import { useAppStore } from '@/store/store';
import { withAuth } from '@/lib/withAuth';

function PrivateShell({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const { errorMessage, setError } = useAppStore();

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
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
      <div className="grid grid-cols-12 gap-6">
        <Sidebar />
        <section className="col-span-12 sm:col-span-9 lg:col-span-10">
          <header className="mb-6 flex items-center justify-between">
            <div className="text-sm">{t('welcomeBack')}</div>
            <a className="btn-accent" href="/add-entry">
              {t('addEntry')}
            </a>
          </header>
          <main>{children}</main>
          <footer className="mt-12 border-t border-white/10 pt-6 text-xs">
            <p>© {new Date().getFullYear()} Fitness Journal</p>
          </footer>
        </section>
      </div>
    </main>
  );
}

export default withAuth(PrivateShell);
