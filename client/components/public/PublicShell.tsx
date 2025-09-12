'use client';

import { useI18n } from '@/lib/i18n';
import { useAppStore } from '@/store/store';
import Header from '@/components/landing/Header';
import FooterSection from '@/components/landing/FooterSection';

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const { errorMessage, setError } = useAppStore();

  return (
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
      <Header />
      <section className="min-h-screen pt-1">
        <main>{children}</main>
        <FooterSection />
      </section>
    </>
  );
}
