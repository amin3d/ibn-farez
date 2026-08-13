import changelogData from "@/public/data/changelog.json";
import { APP_VERSION } from "@/lib/version";

export interface ChangelogEntry {
  version: string;
  date?: string;
  title?: string;
  features: string[];
}

export interface ChangelogData {
  entries: ChangelogEntry[];
}

const changelog = changelogData as ChangelogData;

function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map((n) => Number.parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => Number.parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/** ورودی‌هایی که کاربر هنوز ندیده (تا نسخهٔ فعلی) */
export function getUnseenChangelogEntries(lastSeenVersion: string): ChangelogEntry[] {
  if (!lastSeenVersion) {
    return changelog.entries.filter((e) => e.version === APP_VERSION);
  }
  return changelog.entries.filter(
    (e) =>
      compareVersions(e.version, lastSeenVersion) > 0 &&
      compareVersions(e.version, APP_VERSION) <= 0
  );
}

export { APP_VERSION };
