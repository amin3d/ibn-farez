/** راهنمای بیت: بخشی از مصرع اول */
export function getVerseHint(first: string, wordRatio = 0.35): string {
  const trimmed = first.trim();
  if (!trimmed) return "";
  const words = trimmed.split(/\s+/);
  if (words.length <= 2) return trimmed;
  const count = Math.max(2, Math.ceil(words.length * wordRatio));
  return `${words.slice(0, count).join(" ")} …`;
}

export type VerseRevealPhase = "hidden" | "hint" | "revealed";

export function getRevealPhase(
  elapsedSeconds: number,
  hintDelay: number,
  revealDelay: number
): VerseRevealPhase {
  if (elapsedSeconds >= revealDelay) return "revealed";
  if (elapsedSeconds >= hintDelay) return "hint";
  return "hidden";
}
