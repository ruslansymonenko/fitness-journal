import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fitness Journal",
  description: "Minimal fitness journal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid grid-cols-12 gap-6">
            <aside className="col-span-12 sm:col-span-3 lg:col-span-2">
              <div className="card sticky top-6">
                <div className="mb-4 flex items-center justify-between">
                  <h1 className="text-lg font-semibold tracking-tight">Fitness</h1>
                </div>
                <nav className="space-y-1 text-sm">
                  <a className="block rounded px-3 py-2 hover:bg-white/5" href="/">Overview</a>
                  <a className="block rounded px-3 py-2 hover:bg-white/5" href="/journal">Journal</a>
                  <a className="block rounded px-3 py-2 hover:bg-white/5" href="/add">Add Entry</a>
                </nav>
              </div>
            </aside>
            <section className="col-span-12 sm:col-span-9 lg:col-span-10">
              <header className="mb-6 flex items-center justify-between">
                <div className="text-sm text-white/70">Welcome back!</div>
                <a className="btn-accent" href="/add">Add Entry</a>
              </header>
              <main>{children}</main>
              <footer className="mt-12 border-t border-white/10 pt-6 text-xs text-white/60">
                <p>© {new Date().getFullYear()} Fitness Journal</p>
              </footer>
            </section>
          </div>
        </div>
      </body>
    </html>
  );
}


