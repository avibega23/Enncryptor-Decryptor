"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EncryptionPanel } from "@/components/encryption-panel";
import { DecryptionPanel } from "@/components/decryption-panel";

interface CryptoWorkspaceProps {
  mode: "encrypt" | "decrypt";
}

export function CryptoWorkspace({ mode }: CryptoWorkspaceProps) {
  const router = useRouter();

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <Tabs
          value={mode}
          onValueChange={(value) => router.push(`/${value}`)}
          className="w-full"
        >
          <TabsList className="w-full">
            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
          </TabsList>
        </Tabs>
        <CardTitle className="pt-2">
          {mode === "encrypt" ? "Encrypt a file" : "Decrypt a file"}
        </CardTitle>
        <CardDescription>
          {mode === "encrypt"
            ? "Choose a file and a password to protect it with AES-256-GCM."
            : "Select a .secure file and enter the password used to encrypt it."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mode === "encrypt" ? <EncryptionPanel /> : <DecryptionPanel />}
        <div className="mt-6 flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p>
            Your file is processed locally in your browser and is never uploaded to our
            servers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
