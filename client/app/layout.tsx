import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';
import { QueryProvider } from '@/lib/QueryProvider';
import CommonShell from '@/components/common/CommonShell';

export const metadata: Metadata = {
  title: 'Fitness Journal',
  description: 'Your fitness journal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <I18nProvider>
        <CommonShell>{children}</CommonShell>
      </I18nProvider>
    </QueryProvider>
  );
}
