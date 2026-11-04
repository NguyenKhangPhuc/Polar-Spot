import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * PURPOSE:
 * Formats a score, grade, or telemetry numeric value with a fixed number of decimal places (default 2).
 * Handles null, undefined, empty string, or NaN gracefully by returning a fallback string (default "0.00").
 *
 * INPUTS:
 * - score: number | string | null | undefined
 * - decimals: number (default 2)
 * - fallback: string (default "0.00")
 *
 * RETURNS:
 * - Formatted string (e.g., "85.25", "0.00")
 */
export function formatScore(
  score: number | string | null | undefined,
  decimals: number = 2,
  fallback: string = "0.00"
): string {
  if (score === null || score === undefined || score === "") {
    return fallback;
  }
  const num = typeof score === "number" ? score : Number(score);
  if (isNaN(num)) {
    return fallback;
  }
  return num.toFixed(decimals);
}

