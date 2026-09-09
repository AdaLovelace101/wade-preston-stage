import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Loader2, MapPin, Clock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { formatDate, formatTimeRange, formatLocation, isUpcoming } from "@/lib/eventUtils";
import EventCard from "@/components/site/EventCard";
import EventDetailsModal from "@/components/site/EventDetailsModal";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/siteConfig";
import { Image } from "@/components/ui/image";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const all = await base44.entities.Event.list("-event_date", 200);
        if (!mounted) return;
        const upcoming = all
          .filter(isUpcoming)
          .sort((a, b) => (a.event_date || "").localeCompare(b.event_date || ""))
          .slice(0, 3);
        setEvents(upcoming);
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

  return (
    <section className="py-24 md:py-32 bg-secondary/30 border-y border-border/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="text-[11px] uppercase tracking-playbill text-primary mb-4">
              On Stage
            </p>
            <h2 className="font-display font-light text-4xl md:text-5xl lg:text-6xl leading-tight">
              Upcoming Performances
            </h2>
          </div>
          <Link
            to="/calendar"
            className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-playbill text-primary hover:text-primary/80 transition-colors"
          >
            View Full Calendar
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : failed ? (
          <p className="text-center py-16 text-muted-foreground">
            Something went wrong while loading the calendar. Please try again later.
          </p>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <CalendarDays className="w-10 h-10 text-primary/40 mx-auto mb-4" />
            <p className="text-foreground/70 text-lg font-display">
              No upcoming performances are currently scheduled.
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Please check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {events.map((e) => (
              <EventCard key={e.id} event={e} onClick={() => setSelected(e)} />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <EventDetailsModal event={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}