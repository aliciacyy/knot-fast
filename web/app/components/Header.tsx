'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex items-center justify-between rounded-3xl border border-black/10 bg-white/60 px-5 py-3 backdrop-blur shadow-sm">
          {/* LEFT: Logo / Site name */}
          <Link
            href="/"
            className="flex items-center gap-2 font-serif text-xl tracking-tight text-black/90"
          >
            <img
              src="/icon.png"
              alt="Knot Fast logo"
              className="h-6 w-6 rounded-sm"
            />
            <span>Knot Fast</span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-black/70 md:flex">
            <Link href="/crochets" className="hover:text-black/90 transition">
              Crochets
            </Link>
            <Link href="/runs" className="hover:text-black/90 transition">
              Runs
            </Link>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-black/70"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1">
              <span className="h-0.5 w-5 bg-black/70" />
              <span className="h-0.5 w-5 bg-black/70" />
              <span className="h-0.5 w-5 bg-black/70" />
            </div>
          </button>
        </div>

        {/* MOBILE DROPDOWN */}
        {open && (
          <div className="md:hidden">
            <div className="animate-dropdownIn mt-3 rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm backdrop-blur">
              <nav className="flex flex-col gap-3 text-sm font-medium text-black/70">
                <Link
                  href="/crochets"
                  onClick={() => setOpen(false)}
                  className="hover:text-black/90 transition"
                >
                  Crochets
                </Link>
                <Link
                  href="/runs"
                  onClick={() => setOpen(false)}
                  className="hover:text-black/90 transition"
                >
                  Runs
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
