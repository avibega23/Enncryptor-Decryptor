"use client";

import { useCallback, useRef, useState } from "react";
import { FileIcon, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MAX_FILE_SIZE_BYTES, WARN_FILE_SIZE_BYTES } from "@/lib/crypto/constants";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

interface FileDropzoneProps {
  accept?: string;
  acceptLabel?: string;
  onFileSelected: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  disabled?: boolean;
}

export function FileDropzone({
  accept,
  acceptLabel,
  onFileSelected,
  selectedFile,
  onClear,
  disabled,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [pendingLargeFile, setPendingLargeFile] = useState<File | null>(null);
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const evaluateFile = useCallback(
    (file: File) => {
      setRejectionMessage(null);
      setPendingLargeFile(null);

      if (accept && !file.name.toLowerCase().endsWith(accept)) {
        setRejectionMessage(`Please select a ${accept} file to decrypt.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setRejectionMessage(
          "This file is too large (over 1GB). Browser-based encryption can't safely handle files this size."
        );
        return;
      }

      if (file.size > WARN_FILE_SIZE_BYTES) {
        setPendingLargeFile(file);
        return;
      }

      onFileSelected(file);
    },
    [accept, onFileSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      const file = e.dataTransfer.files?.[0];
      if (file) evaluateFile(file);
    },
    [disabled, evaluateFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) evaluateFile(file);
      e.target.value = "";
    },
    [evaluateFile]
  );

  if (selectedFile) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 animate-in fade-in slide-in-from-bottom-1 duration-300">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary">
            <FileIcon className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">{formatBytes(selectedFile.size)}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          disabled={disabled}
          aria-label="Remove file"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (pendingLargeFile) {
    return (
      <Alert variant="default" className="border-amber-500/40">
        <AlertTitle>Large file detected</AlertTitle>
        <AlertDescription>
          <p className="mb-3">
            {formatBytes(pendingLargeFile.size)} may use significant memory and take a while to
            process, since the entire file is loaded into your browser&apos;s memory.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                onFileSelected(pendingLargeFile);
                setPendingLargeFile(null);
              }}
            >
              Continue
            </Button>
            <Button size="sm" variant="outline" onClick={() => setPendingLargeFile(null)}>
              Cancel
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) inputRef.current?.click();
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-12 text-center transition-colors duration-200",
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:border-foreground/40 hover:bg-accent/50",
          isDragOver ? "border-foreground bg-accent" : "border-border"
        )}
      >
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full bg-secondary transition-transform duration-200",
            isDragOver && "scale-110"
          )}
        >
          <UploadCloud className="h-6 w-6 text-secondary-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">Drop your file here</p>
          <p className="text-xs text-muted-foreground">
            or <span className="underline underline-offset-2">browse files</span>
          </p>
        </div>
        {acceptLabel && <p className="text-xs text-muted-foreground">{acceptLabel}</p>}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>
      {rejectionMessage && (
        <Alert variant="destructive">
          <AlertDescription>{rejectionMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
