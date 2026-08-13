"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getUnseenChangelogEntries, type ChangelogEntry } from "@/lib/changelog";
import { APP_VERSION } from "@/lib/version";
import { getLastSeenVersion, setLastSeenVersion } from "@/lib/db";

export default function ChangelogModal() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);

  useEffect(() => {
    void (async () => {
      const lastSeen = await getLastSeenVersion();
      if (lastSeen === APP_VERSION) return;

      const unseen = getUnseenChangelogEntries(lastSeen);
      if (unseen.length === 0) return;

      setEntries(unseen);
      setOpen(true);
    })();
  }, []);

  const handleClose = () => {
    setOpen(false);
    void setLastSeenVersion(APP_VERSION);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
      <DialogContent
        dir="rtl"
        closeButtonSide="left"
        className="sm:max-w-md text-right"
      >
        <DialogHeader className="text-right items-start pr-10">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-secondary shrink-0" />
            تغییرات نسخه {APP_VERSION}
          </DialogTitle>
          <DialogDescription className="text-right">
            ویژگی‌های جدید این به‌روزرسانی:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[50vh] overflow-y-auto">
          {entries.map((entry) => (
            <div key={entry.version} className="space-y-2">
              {entry.title && (
                <p className="text-sm font-medium text-foreground">{entry.title}</p>
              )}
              {entry.date && (
                <p className="text-xs text-muted-foreground">{entry.date}</p>
              )}
              <ul className="space-y-2 pr-1">
                {entry.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-sm text-muted-foreground flex gap-2 items-start"
                  >
                    <span
                      className="mt-2 w-1.5 h-1.5 rounded-full bg-secondary shrink-0"
                      aria-hidden
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <DialogFooter className="sm:flex-row-reverse sm:justify-start">
          <Button type="button" onClick={handleClose}>
            متوجه شدم
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
