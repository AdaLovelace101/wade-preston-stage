import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { X, Calendar, Clock, MapPin } from "lucide-react";
import { formatDate, formatTime, formatTimeRange, formatLocation } from "@/lib/eventUtils";

export default function EventDetailsModal({ event, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const location = formatLocation(event.city, event.state);
  const timeRange = formatTimeRange(event.start_time, event.end_time);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={event.title}
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-lg bg-card border border-border rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          aria-label="Close event details"
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-7 sm:p-9">
          <div className="flex items-center gap-2 text-primary mb-4">
            <Calendar className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-playbill">
              {formatDate(event.event_date)}
            </span>
          </div>

          <h2 className="font-display font-light text-3xl md:text-4xl leading-tight mb-6 pr-8">
            {event.title}
          </h2>

          <div className="space-y-4 border-t border-border/60 pt-6">
            {timeRange && (
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-[11px] uppercase tracking-playbill text-muted-foreground mb-1">
                    Time
                  </p>
                  <p className="text-foreground/90">{timeRange}</p>
                </div>
              </div>
            )}

            {event.venue && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-[11px] uppercase tracking-playbill text-muted-foreground mb-1">
                    Venue
                  </p>
                  <p className="text-foreground/90">{event.venue}</p>
                </div>
              </div>
            )}

            {(location || event.address) && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-[11px] uppercase tracking-playbill text-muted-foreground mb-1">
                    Location
                  </p>
                  <p className="text-foreground/90">
                    {[event.address, location].filter(Boolean).join(" — ")}
                  </p>
                </div>
              </div>
            )}

            {event.description && (
              <div className="pt-2">
                <p className="text-[11px] uppercase tracking-playbill text-muted-foreground mb-2">
                  About
                </p>
                <p className="text-foreground/80 leading-[1.7] whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  );
}