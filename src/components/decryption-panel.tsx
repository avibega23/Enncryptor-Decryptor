"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Unlock, ShieldCheck, Download, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileDropzone } from "@/components/file-dropzone";
import { PasswordInput } from "@/components/password-input";
import { StageProgress } from "@/components/stage-progress";
import { decryptFile } from "@/lib/crypto/decrypt";
import { getErrorMessage } from "@/lib/crypto/error-messages";
import { FILE_EXTENSION } from "@/lib/crypto/constants";
import { ProgressStage } from "@/types/crypto";

const STAGES: { key: ProgressStage; label: string }[] = [
  { key: "reading", label: "Reading file" },
  { key: "deriving-key", label: "Deriving encryption key" },
  { key: "decrypting", label: "Decrypting file" },
  { key: "done", label: "Done" },
];

export function DecryptionPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState<ProgressStage | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string | null>(null);

  const isProcessing = stage !== null && stage !== "done";
  const canDecrypt = Boolean(file) && password.length > 0 && !isProcessing;

  const reset = useCallback(() => {
    setFile(null);
    setPassword("");
    setStage(null);
    setErrorMessage(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setDownloadName(null);
  }, [downloadUrl]);

  const handleDecrypt = useCallback(async () => {
    if (!file) return;
    setErrorMessage(null);

    try {
      const result = await decryptFile(file, password, (s) => setStage(s));
      const url = URL.createObjectURL(result.blob);
      setDownloadUrl(url);
      setDownloadName(result.filename);
      toast.success("File decrypted successfully", {
        description: "Your original file is ready to download.",
      });
    } catch (err) {
      const message = getErrorMessage(err);
      setErrorMessage(message);
      setStage(null);
      toast.error("Decryption failed", { description: message });
    } finally {
      setPassword("");
    }
  }, [file, password]);

  return (
    <div className="space-y-6">
      <FileDropzone
        accept={FILE_EXTENSION}
        acceptLabel={`Only ${FILE_EXTENSION} files are supported`}
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
        <PasswordInput
          label="Decryption password"
          value={password}
          onChange={setPassword}
          disabled={isProcessing}
          placeholder="Enter the password used to encrypt this file"
        />
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Decryption failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {isProcessing && <StageProgress stages={STAGES} currentStage={stage} />}

      {downloadUrl && downloadName && (
        <Alert className="border-emerald-500/40 animate-in fade-in zoom-in-95 duration-300">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <AlertTitle>Your file has been decrypted</AlertTitle>
          <AlertDescription>
            Here is your original file, restored exactly as it was.
          </AlertDescription>
          <div className="col-start-2 mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm">
              <a href={downloadUrl} download={downloadName}>
                <Download className="h-4 w-4" />
                Download {downloadName}
              </a>
            </Button>
            <Button size="sm" variant="outline" onClick={reset}>
              Decrypt another file
            </Button>
          </div>
        </Alert>
      )}

      {!downloadUrl && (
        <Button className="w-full" size="lg" disabled={!canDecrypt} onClick={handleDecrypt}>
          {isProcessing ? (
            <>
              <KeyRound className="h-4 w-4 animate-pulse" />
              Decrypting…
            </>
          ) : (
            <>
              <Unlock className="h-4 w-4" />
              Decrypt file
            </>
          )}
        </Button>
      )}
    </div>
  );
}
