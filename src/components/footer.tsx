import { ShieldHalf } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { GithubMark } from "@/components/github-mark";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ShieldHalf className="h-4 w-4" />
            <span>File Encryptor</span>
          </div>

          {/* TODO: replace with actual GitHub repo URL */}
          <a
            href="https://github.com/REPLACE_ME"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <GithubMark className="h-4 w-4" />
            View source on GitHub
          </a>
        </div>

        <Separator className="my-6" />

        <div className="space-y-3 text-sm text-muted-foreground">
          <p>Next.js · TypeScript · Tailwind CSS · shadcn/ui · Web Crypto API</p>
          <p className="max-w-2xl text-xs">
            All encryption and decryption happen entirely in your browser. Files and passwords
            are never uploaded, transmitted, or stored on any server.
          </p>
        </div>

        <Separator className="my-6" />

        <div className="text-sm">
          <p className="font-medium text-foreground">Created by Jasdeep Singh</p>
          <p className="text-muted-foreground">12401150</p>
        </div>
      </div>
    </footer>
  );
}
