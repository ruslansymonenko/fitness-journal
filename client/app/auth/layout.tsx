import type { Metadata } from 'next';
import '@/app/globals.css';
import { I18nProvider } from '@/lib/i18n';
import PublicShell from '@/components/public/PublicShell';

export const metadata: Metadata = {
  title: 'Fitness Journal',
  description: 'Your fitness journal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <PublicShell>{children}</PublicShell>
    </I18nProvider>
  );
}
