"use client";

import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressStage } from "@/types/crypto";

interface StageProgressProps {
  stages: { key: ProgressStage; label: string }[];
  currentStage: ProgressStage | null;
}

export function StageProgress({ stages, currentStage }: StageProgressProps) {
  if (!currentStage) return null;

  const currentIndex = stages.findIndex((s) => s.key === currentStage);

  return (
    <div className="space-y-2.5 rounded-lg border border-border bg-card p-4 animate-in fade-in duration-300">
      {stages.map((stage, index) => {
        const isComplete = index < currentIndex || currentStage === "done";
        const isActive = index === currentIndex && currentStage !== "done";

        return (
          <div key={stage.key} className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] transition-colors",
                isComplete && "border-foreground bg-foreground text-background",
                isActive && "border-foreground",
                !isComplete && !isActive && "border-border text-muted-foreground"
              )}
            >
              {isComplete ? (
                <Check className="h-3 w-3" />
              ) : isActive ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={cn(
                "text-sm transition-colors",
                isComplete || isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {stage.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
