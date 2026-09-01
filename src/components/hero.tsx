import Link from "next/link";
import { Lock, Unlock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-20 text-center sm:px-6 sm:py-28">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-border" />
          <div className="absolute inset-3 rounded-full border border-border" />
          <div className="absolute inset-6 animate-pulse rounded-full border border-foreground/30" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background shadow-lg">
            <Lock className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Secure Your Files.
            <br />
            Keep Your Data Private.
          </h1>
          <p className="mx-auto max-w-xl text-balance text-muted-foreground sm:text-lg">
            Encrypt and decrypt files directly in your browser using AES-256-GCM — modern,
            authenticated encryption. Nothing is ever uploaded to a server.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/encrypt">
              <Lock className="h-4 w-4" />
              Encrypt a File
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/decrypt">
              <Unlock className="h-4 w-4" />
              Decrypt a File
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Processed locally · AES-256-GCM · Never uploaded</span>
        </div>
      </div>
    </section>
  );
}
