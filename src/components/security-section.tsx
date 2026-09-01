import { KeySquare, Lock, MonitorSmartphone, Dices } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Lock,
    title: "AES-256-GCM",
    description:
      "Authenticated encryption designed to protect both confidentiality and integrity.",
  },
  {
    icon: KeySquare,
    title: "PBKDF2",
    description:
      "Derives a cryptographic key from your password using a salt and computationally expensive hashing.",
  },
  {
    icon: MonitorSmartphone,
    title: "Client-Side Processing",
    description:
      "Files are processed directly in the browser rather than being uploaded to a server.",
  },
  {
    icon: Dices,
    title: "Random IV & Salt",
    description:
      "Cryptographically secure random values are generated for every encryption operation.",
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mb-12 space-y-3 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Built on real cryptography
        </h2>
        <p className="mx-auto max-w-xl text-muted-foreground">
          No shortcuts, no reversible encoding — just standard, well-reviewed primitives from
          the Web Crypto API.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                <Icon className="h-4 w-4" />
              </div>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
