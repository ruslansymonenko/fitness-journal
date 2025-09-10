"use client";

import { useI18n } from "../lib/i18n";

/**
 * Client header to translate Journal title.
 */
export default function JournalHeader() {
  const { t } = useI18n();
  return <h2 className="mb-6 text-2xl font-medium">{t("journal")}</h2>;
}


