"use client";

import Link from "next/link";
import { useState } from "react";
import { ShieldHalf, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GithubMark } from "@/components/github-mark";

const NAV_LINKS = [
  { href: "/encrypt", label: "Encrypt" },
  { href: "/decrypt", label: "Decrypt" },
  { href: "/security", label: "Security" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-medium tracking-tight">
          <ShieldHalf className="h-5 w-5" />
          <span>File Encryptor</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/REPLACE_ME"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
            >
              <GithubMark className="h-4 w-4" />
            </a>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open && (
        <nav className="border-t border-border px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3 text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/REPLACE_ME"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <GithubMark className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
