import type { Metadata } from 'next';
import '../globals.css';
import { I18nProvider } from '@/lib/i18n';
import PrivateShell from '@/components/private/PrivateShell';

export const metadata: Metadata = {
  title: 'Fitness Journal',
  description: 'Your fitness journal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <PrivateShell>{children}</PrivateShell>
    </I18nProvider>
  );
}
