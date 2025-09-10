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
        <div className="mx-auto max-w-3xl px-4 py-8">
          <header className="mb-10 flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">Fitness Journal</h1>
            <nav className="text-sm">
              <a className="mr-4 rounded px-3 py-2 transition hover:bg-white/5" href="/">Home</a>
              <a className="mr-4 rounded px-3 py-2 transition hover:bg-white/5" href="/journal">Journal</a>
              <a className="rounded bg-brand.accent px-3 py-2 text-black transition hover:opacity-90" href="/add">Add Entry</a>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="mt-12 border-t border-white/10 pt-6 text-xs text-white/60">
            <p>© {new Date().getFullYear()} Fitness Journal</p>
          </footer>
        </div>
      </body>
    </html>
  );
}


