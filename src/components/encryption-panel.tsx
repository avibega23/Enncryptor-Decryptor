"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Lock, ShieldCheck, Download, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileDropzone } from "@/components/file-dropzone";
import { PasswordInput } from "@/components/password-input";
import { PasswordStrengthMeter } from "@/components/password-strength-meter";
import { StageProgress } from "@/components/stage-progress";
import { encryptFile } from "@/lib/crypto/encrypt";
import { getErrorMessage } from "@/lib/crypto/error-messages";
import { FILE_EXTENSION } from "@/lib/crypto/constants";
import { ProgressStage } from "@/types/crypto";

const STAGES: { key: ProgressStage; label: string }[] = [
  { key: "reading", label: "Reading file" },
  { key: "deriving-key", label: "Deriving encryption key" },
  { key: "encrypting", label: "Encrypting file" },
  { key: "done", label: "Done" },
];

export function EncryptionPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState<ProgressStage | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string | null>(null);

  const isProcessing = stage !== null && stage !== "done";
  const canEncrypt = Boolean(file) && password.length > 0 && !isProcessing;

  const reset = useCallback(() => {
    setFile(null);
    setPassword("");
    setStage(null);
    setErrorMessage(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setDownloadName(null);
  }, [downloadUrl]);

  const handleEncrypt = useCallback(async () => {
    if (!file) return;
    setErrorMessage(null);

    try {
      const blob = await encryptFile(file, password, (s) => setStage(s));
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadName(`${file.name}${FILE_EXTENSION}`);
      toast.success("File encrypted successfully", {
        description: "Your encrypted file is ready to download.",
      });
    } catch (err) {
      const message = getErrorMessage(err);
      setErrorMessage(message);
      setStage(null);
      toast.error("Encryption failed", { description: message });
    } finally {
      setPassword("");
    }
  }, [file, password]);

  return (
    <div className="space-y-6">
      <FileDropzone
        selectedFile={file}
        onFileSelected={(f) => {
          setFile(f);
          setErrorMessage(null);
          setDownloadUrl(null);
        }}
        onClear={reset}
        disabled={isProcessing}
      />

      {file && !downloadUrl && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-1 duration-300">
          <PasswordInput
            label="Encryption password"
            value={password}
            onChange={setPassword}
            disabled={isProcessing}
            placeholder="Choose a strong password"
          />
          <PasswordStrengthMeter password={password} />
        </div>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Encryption failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {isProcessing && <StageProgress stages={STAGES} currentStage={stage} />}

      {downloadUrl && downloadName && (
        <Alert className="border-emerald-500/40 animate-in fade-in zoom-in-95 duration-300">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <AlertTitle>Your file has been encrypted</AlertTitle>
          <AlertDescription>
            Save this file somewhere safe — you&apos;ll need your password to decrypt it.
          </AlertDescription>
          <div className="col-start-2 mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm">
              <a href={downloadUrl} download={downloadName}>
                <Download className="h-4 w-4" />
                Download {downloadName}
              </a>
            </Button>
            <Button size="sm" variant="outline" onClick={reset}>
              Encrypt another file
            </Button>
          </div>
        </Alert>
      )}

      {!downloadUrl && (
        <Button className="w-full" size="lg" disabled={!canEncrypt} onClick={handleEncrypt}>
          {isProcessing ? (
            <>
              <KeyRound className="h-4 w-4 animate-pulse" />
              Encrypting…
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              Encrypt file
            </>
          )}
        </Button>
      )}
    </div>
  );
}
