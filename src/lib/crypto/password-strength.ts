import { PasswordStrength, PasswordStrengthResult } from "@/types/crypto";

const COMMON_PATTERNS = [
  /password/i,
  /qwerty/i,
  /letmein/i,
  /admin/i,
  /^12345678/,
  /012345|123456|234567|345678|456789/,
  /abcdef|bcdefg|cdefgh/i,
];

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const feedback: string[] = [];

  if (password.length === 0) {
    return { strength: "very-weak", score: 0, feedback: ["Enter a password"] };
  }

  let score = Math.min(password.length * 4, 40);
  if (password.length < 12) {
    feedback.push("Use at least 12 characters");
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  if (hasLower) score += 10;
  else feedback.push("Add a lowercase letter");

  if (hasUpper) score += 10;
  else feedback.push("Add an uppercase letter");

  if (hasDigit) score += 10;
  else feedback.push("Add a number");

  if (hasSymbol) score += 10;
  else feedback.push("Add a symbol");

  const uniqueRatio = new Set(password).size / password.length;
  if (uniqueRatio > 0.6) {
    score += 10;
  } else {
    feedback.push("Avoid repeated characters");
  }

  if (COMMON_PATTERNS.some((pattern) => pattern.test(password))) {
    score -= 20;
    feedback.push("Avoid common words or sequences");
  }

  score = Math.max(0, Math.min(100, score));

  let strength: PasswordStrength;
  if (score < 20) strength = "very-weak";
  else if (score < 40) strength = "weak";
  else if (score < 60) strength = "fair";
  else if (score < 80) strength = "strong";
  else strength = "very-strong";

  return { strength, score, feedback };
}
