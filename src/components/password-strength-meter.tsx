"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { evaluatePasswordStrength } from "@/lib/crypto/password-strength";
import { cn } from "@/lib/utils";
import { PasswordStrength } from "@/types/crypto";

const STRENGTH_LABEL: Record<PasswordStrength, string> = {
  "very-weak": "Very weak",
  weak: "Weak",
  fair: "Fair",
  strong: "Strong",
  "very-strong": "Very strong",
};

const STRENGTH_COLOR: Record<PasswordStrength, string> = {
  "very-weak": "[&>div]:bg-red-500",
  weak: "[&>div]:bg-red-500",
  fair: "[&>div]:bg-amber-500",
  strong: "[&>div]:bg-emerald-500",
  "very-strong": "[&>div]:bg-emerald-500",
};

export function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null;

  const { strength, score, feedback } = evaluatePasswordStrength(password);

  return (
    <div className="space-y-2 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <Progress value={score} className={cn("h-1.5", STRENGTH_COLOR[strength])} />
        <span className="ml-3 shrink-0 text-xs font-medium text-muted-foreground">
          {STRENGTH_LABEL[strength]}
        </span>
      </div>
      {feedback.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {feedback.slice(0, 3).map((tip) => (
            <Badge key={tip} variant="outline" className="font-normal text-muted-foreground">
              {tip}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
