import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SecuritySection } from "@/components/security-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            How this app protects your files
          </h1>
          <p className="mt-4 text-muted-foreground">
            File Encryptor is a client-side security tool: every cryptographic operation runs
            in your browser using the native Web Crypto API. No file, password, or key ever
            leaves your device.
          </p>
        </div>

        <SecuritySection />

        <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <Card>
            <CardHeader>
              <CardTitle>The .secure file format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Encrypted files are saved with a <code className="rounded bg-muted px-1 py-0.5 text-xs">.secure</code> extension
                and contain everything needed to decrypt them later, except the password
                itself:
              </p>
              <ul className="list-inside list-disc space-y-1">
                <li>Format version and algorithm identifiers</li>
                <li>A randomly generated salt, used to derive the encryption key from your password</li>
                <li>A randomly generated IV (nonce), required by AES-GCM</li>
                <li>The original filename and MIME type, restored on decryption</li>
                <li>The encrypted file contents, authenticated with a GCM tag</li>
              </ul>
              <p>
                Your password is never written to the file, never logged, and never stored —
                it exists only in memory for as long as it takes to derive the key.
              </p>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>About this project</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                File Encryptor / Decryptor is a cybersecurity project by Jasdeep Singh,
                demonstrating a practical, production-quality implementation of client-side
                authenticated encryption using modern web standards.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
