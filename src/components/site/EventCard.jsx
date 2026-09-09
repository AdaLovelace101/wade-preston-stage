import React from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import { formatDate, formatTimeRange, formatLocation } from "@/lib/eventUtils";

export default function EventCard({ event, onClick }) {
  const location = formatLocation(event.city, event.state);
  const timeRange = formatTimeRange(event.start_time, event.end_time);

  return (
    <button
      onClick={onClick}
      className="group text-left bg-card border border-border/60 rounded-sm overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-1 hover:brass-glow flex flex-col"
    >
      <div className="p-7 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-primary mb-5">
          <Calendar className="w-4 h-4" />
          <span className="text-[11px] uppercase tracking-playbill">
            {formatDate(event.event_date)}
          </span>
        </div>

        <h3 className="font-display text-2xl leading-snug mb-4 group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        <div className="mt-auto space-y-2 text-sm text-muted-foreground">
          {event.venue && (
            <p className="text-foreground/80">{event.venue}</p>
          )}
          {location && (
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {location}
            </p>
          )}
          {timeRange && (
            <p className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              {timeRange}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}