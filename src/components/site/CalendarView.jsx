import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Loader2, MapPin, Clock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { formatDate, formatShortDate, formatMonthYear, formatTimeRange, formatLocation } from "@/lib/eventUtils";
import EventDetailsModal from "@/components/site/EventDetailsModal";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [selected, setSelected] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const all = await base44.entities.Event.list("-event_date", 500);
        if (mounted) setEvents(all);
      } catch (err) {
        if (mounted) setFailed(true);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      if (e.event_date) {
        (map[e.event_date] ||= []).push(e);
      }
    });
    return map;
  }, [events]);

  const monthEvents = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
    return events
      .filter((e) => (e.event_date || "").startsWith(prefix))
      .sort((a, b) => {
        const d = (a.event_date || "").localeCompare(b.event_date || "");
        if (d !== 0) return d;
        return (a.start_time || "").localeCompare(b.start_time || "");
      });
  }, [events, year, month]);

  const todayKey = (() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
  })();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ day: d, key, evts: eventsByDate[key] || [] });
  }

  const prevMonth = () => setCursor(new Date(year, month - 1, 1));
  const nextMonth = () => setCursor(new Date(year, month + 1, 1));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (failed) {
    return (
      <p className="text-center py-24 text-muted-foreground">
        Something went wrong while loading the calendar. Please try again later.
      </p>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={prevMonth}
          aria-label="Previous month"
          className="p-3 text-foreground/70 hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-display font-light text-3xl md:text-4xl text-center">
          {formatMonthYear(year, month)}
        </h2>
        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="p-3 text-foreground/70 hover:text-primary transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {isMobile ? (
        <AgendaList monthEvents={monthEvents} onSelect={setSelected} />
      ) : (
        <div className="grid grid-cols-7 gap-px bg-border/40 border border-border/40 rounded-sm overflow-hidden">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="bg-secondary/40 text-center py-3 text-[10px] uppercase tracking-playbill text-muted-foreground"
            >
              {d}
            </div>
          ))}
          {cells.map((cell, i) => (
            <div
              key={i}
              className={`min-h-[110px] bg-card p-2 ${
                cell ? "" : "bg-secondary/20"
              }`}
            >
              {cell && (
                <>
                  <div
                    className={`text-xs mb-1 ${
                      cell.key === todayKey
                        ? "inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {cell.day}
                  </div>
                  <div className="space-y-1">
                    {cell.evts.slice(0, 2).map((e) => (
                      <button
                        key={e.id}
                        onClick={() => setSelected(e)}
                        className="block w-full text-left px-2 py-1 rounded-sm bg-primary/10 border-l-2 border-primary hover:bg-primary/20 transition-colors"
                      >
                        <p className="text-[11px] text-foreground/90 truncate leading-tight">
                          {e.title}
                        </p>
                        {e.start_time && (
                          <p className="text-[10px] text-muted-foreground">
                            {formatTimeRange(e.start_time, e.end_time)}
                          </p>
                        )}
                      </button>
                    ))}
                    {cell.evts.length > 2 && (
                      <p className="text-[10px] text-primary px-2">
                        +{cell.evts.length - 2} more
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {selected && (
        <EventDetailsModal event={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

function AgendaList({ monthEvents, onSelect }) {
  if (monthEvents.length === 0) {
    return (
      <div className="text-center py-16 border border-border/40 rounded-sm">
        <CalendarDays className="w-10 h-10 text-primary/40 mx-auto mb-4" />
        <p className="text-foreground/70 font-display text-lg">
          No performances scheduled this month.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {monthEvents.map((e) => {
        const location = formatLocation(e.city, e.state);
        const timeRange = formatTimeRange(e.start_time, e.end_time);
        return (
          <button
            key={e.id}
            onClick={() => onSelect(e)}
            className="w-full text-left flex gap-5 p-5 bg-card border border-border/60 rounded-sm hover:border-primary/50 transition-colors"
          >
            <div className="shrink-0 w-16 text-center border-r border-border/60 pr-4">
              <p className="font-display text-3xl text-primary leading-none">
                {new Date(
                  e.event_date.split("-")[0],
                  e.event_date.split("-")[1] - 1,
                  e.event_date.split("-")[2]
                ).getDate()}
              </p>
              <p className="text-[10px] uppercase tracking-playbill text-muted-foreground mt-1">
                {formatShortDate(e.event_date).split(" ")[0]}
              </p>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-xl leading-snug mb-1">{e.title}</h3>
              {e.venue && (
                <p className="text-sm text-foreground/80 truncate">{e.venue}</p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {location}
                  </span>
                )}
                {timeRange && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {timeRange}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}