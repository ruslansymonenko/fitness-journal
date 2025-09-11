import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { useI18n } from "@/lib/i18n";

export default function Sidebar() {
    const { t } = useI18n();

    return (
        <aside className="col-span-12 sm:col-span-3 lg:col-span-2">
        <div className="card sticky top-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold tracking-tight">{t("fitness")}</h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
          <nav className="space-y-1 text-sm">
            <a className="block rounded px-3 py-2 hover:bg-white/5" href="/">{t("overview")}</a>
            <a className="block rounded px-3 py-2 hover:bg-white/5" href="/journal">{t("journal")}</a>
            <a className="block rounded px-3 py-2 hover:bg-white/5" href="/add">{t("addEntry")}</a>
          </nav>
          <div className="mt-4">
            <LanguageSwitcher />
          </div>
        </div>
      </aside>
    )
}