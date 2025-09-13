'use client';

import { useI18n } from '@/lib/i18n';
import { withAuth } from '@/lib/withAuth';
import AddEntryForm from '@/components/private/forms/AddEntryForm';

function AddEntryPage() {
  const { t } = useI18n();

  return (
    <section className="max-w-xl">
      <h2 className="mb-6 text-2xl font-medium">{t('addEntry')}</h2>
      <AddEntryForm />
    </section>
  );
}

export default withAuth(AddEntryPage);
