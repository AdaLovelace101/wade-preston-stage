import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertTriangle } from "lucide-react";
import { formatDate } from "@/lib/eventUtils";

export default function DeleteConfirmDialog({ event, onCancel, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !deleting && onCancel();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onCancel, deleting]);

  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onCancel} />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-md bg-card border border-border rounded-sm shadow-2xl p-7"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="shrink-0 w-11 h-11 rounded-sm bg-destructive/10 border border-destructive/30 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h2 className="font-display text-2xl mb-1">Delete this event?</h2>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this event? This cannot be undone.
            </p>
          </div>
        </div>

        <div className="mb-6 p-4 rounded-sm bg-secondary/40 border border-border/60">
          <p className="font-display text-lg leading-snug">{event.title}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {formatDate(event.event_date)}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 px-6 py-3 text-[11px] uppercase tracking-playbill border border-border rounded-sm text-foreground/70 hover:bg-secondary/40 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-[11px] uppercase tracking-playbill bg-destructive text-destructive-foreground rounded-sm hover:opacity-90 transition-all disabled:opacity-60"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}