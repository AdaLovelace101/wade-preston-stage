import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Menu, X, ArrowRight, Calendar, CalendarDays, Clock, MapPin,
  ChevronLeft, ChevronRight, Loader2, Instagram, Facebook, Youtube, Music2, Mail,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { siteConfig, formatDate, formatShortDate, formatMonthYear, formatTimeRange, formatLocation, isUpcoming } from "@/lib/site";
import { Image } from "@/components/ui/image";

/* ---------------- Navbar ---------------- */
const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Calendar", to: "/calendar" },
  { label: "Contact", to: "/contact" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/85 backdrop-blur-md border-b border-border/60" : "bg-transparent border-b border-transparent"}`}>
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" aria-label="Wade Preston — Home">
          <img src={siteConfig.images.logo} alt="Wade Preston" className="h-11 w-auto md:h-12 object-contain" />
        </Link>
        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className={`text-[11px] uppercase tracking-[0.2em] font-medium transition-colors duration-300 ${location.pathname === l.to ? "text-primary" : "text-foreground/75 hover:text-primary"}`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <button className="md:hidden p-2 -mr-2 text-foreground" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation menu" aria-expanded={open}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden bg-background/97 backdrop-blur-md border-t border-border/60">
          <ul className="px-6 py-4">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={`block py-4 text-sm uppercase tracking-[0.2em] border-b border-border/40 ${location.pathname === l.to ? "text-primary" : "text-foreground/80"}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  const year = new Date().getFullYear();
  const s = siteConfig.social;
  const socials = [
    { url: s.instagram, icon: Instagram, label: "Instagram" },
    { url: s.facebook, icon: Facebook, label: "Facebook" },
    { url: s.youtube, icon: Youtube, label: "YouTube" },
    { url: s.tiktok, icon: Music2, label: "TikTok" },
  ].filter((item) => item.url);

  return (
    <footer className="bg-background border-t border-border/60 mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <img src={siteConfig.images.logo} alt="Wade Preston" className="h-12 w-auto mb-5 object-contain" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{siteConfig.tagline}</p>
          </div>
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-primary mb-5">Explore</h3>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-foreground/75 hover:text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-primary mb-5">Connect</h3>
            <a href={`mailto:${siteConfig.contactEmail}`} className="flex items-center gap-2 text-sm text-foreground/75 hover:text-primary transition-colors mb-4">
              <Mail className="w-4 h-4" />
              {siteConfig.contactEmail}
            </a>
            {socials.length > 0 && (
              <div className="flex items-center gap-4">
                {socials.map((item) => (
                  <a key={item.label} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={item.label} className="text-foreground/60 hover:text-primary transition-colors">
                    <item.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-14 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {year} {siteConfig.name}. All rights reserved.</p>
          <Link to="/admin" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- PublicLayout ---------------- */
export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}

/* ---------------- Hero ---------------- */
export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image src={siteConfig.images.piano} alt="Wade Preston at the piano" fittingType="fill" focalPointX={0.5} focalPointY={0.5} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full pt-28 pb-20">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-primary mb-6">
          {siteConfig.tagline}
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut", delay: 0.1 }} className="font-display font-light text-[clamp(3.5rem,11vw,9rem)] leading-[0.95] text-foreground text-balance">
          Wade<br />Preston
        </motion.h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }} className="mt-10">
          <Link to="/calendar" className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-medium rounded-sm hover:brass-glow transition-all duration-300">
            See Where Wade Is Performing
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- AboutSection ---------------- */
export function AboutSection() {
  return (
    <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 lg:px-10">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
            <Image src={siteConfig.images.aboutMain} alt="Portrait of Wade Preston" fittingType="fill" focalPointX={0.5} focalPointY={0.4} className="w-full h-full" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary mb-5">About</p>
          <h2 className="font-display font-light text-4xl md:text-5xl lg:text-6xl leading-tight mb-8 text-balance">A virtuoso at the keys. A storyteller on stage.</h2>
          <div className="space-y-5">
            {siteConfig.bio.map((p, i) => (
              <p key={i} className="text-foreground/75 leading-[1.7] text-[15px]">{p}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- EventCard ---------------- */
function EventCard({ event, onClick }) {
  const location = formatLocation(event.city, event.state);
  const timeRange = formatTimeRange(event.start_time, event.end_time);
  return (
    <button onClick={onClick} className="group text-left bg-card border border-border/60 rounded-sm overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-1 hover:brass-glow flex flex-col">
      <div className="p-7 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-primary mb-5">
          <Calendar className="w-4 h-4" />
          <span className="text-[11px] uppercase tracking-[0.2em]">{formatDate(event.event_date)}</span>
        </div>
        <h3 className="font-display text-2xl leading-snug mb-4 group-hover:text-primary transition-colors">{event.title}</h3>
        <div className="mt-auto space-y-2 text-sm text-muted-foreground">
          {event.venue && <p className="text-foreground/80">{event.venue}</p>}
          {location && <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 shrink-0" />{location}</p>}
          {timeRange && <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 shrink-0" />{timeRange}</p>}
        </div>
      </div>
    </button>
  );
}

/* ---------------- EventDetailsModal ---------------- */
function EventDetailsModal({ event, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const location = formatLocation(event.city, event.state);
  const timeRange = formatTimeRange(event.start_time, event.end_time);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label={event.title}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3, ease: "easeOut" }} className="relative w-full max-w-lg bg-card border border-border rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} aria-label="Close event details" className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-primary transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="p-7 sm:p-9">
          <div className="flex items-center gap-2 text-primary mb-4">
            <Calendar className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-[0.2em]">{formatDate(event.event_date)}</span>
          </div>
          <h2 className="font-display font-light text-3xl md:text-4xl leading-tight mb-6 pr-8">{event.title}</h2>
          <div className="space-y-4 border-t border-border/60 pt-6">
            {timeRange && (
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Time</p>
                  <p className="text-foreground/90">{timeRange}</p>
                </div>
              </div>
            )}
            {event.venue && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Venue</p>
                  <p className="text-foreground/90">{event.venue}</p>
                </div>
              </div>
            )}
            {(location || event.address) && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Location</p>
                  <p className="text-foreground/90">{[event.address, location].filter(Boolean).join(" — ")}</p>
                </div>
              </div>
            )}
            {event.description && (
              <div className="pt-2">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">About</p>
                <p className="text-foreground/80 leading-[1.7] whitespace-pre-line">{event.description}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- UpcomingEvents ---------------- */
export function UpcomingEvents() {
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
        setEvents(all.filter(isUpcoming).sort((a, b) => (a.event_date || "").localeCompare(b.event_date || "")).slice(0, 3));
      } catch (err) {
        if (mounted) setFailed(true);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="py-24 md:py-32 bg-secondary/30 border-y border-border/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-primary mb-4">On Stage</p>
            <h2 className="font-display font-light text-4xl md:text-5xl lg:text-6xl leading-tight">Upcoming Performances</h2>
          </div>
          <Link to="/calendar" className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary hover:text-primary/80 transition-colors">
            View Full Calendar
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : failed ? (
          <p className="text-center py-16 text-muted-foreground">Something went wrong while loading the calendar. Please try again later.</p>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <CalendarDays className="w-10 h-10 text-primary/40 mx-auto mb-4" />
            <p className="text-foreground/70 text-lg font-display">No upcoming performances are currently scheduled.</p>
            <p className="text-muted-foreground text-sm mt-2">Please check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {events.map((e) => <EventCard key={e.id} event={e} onClick={() => setSelected(e)} />)}
          </div>
        )}
      </div>
      {selected && <EventDetailsModal event={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

/* ---------------- CalendarView ---------------- */
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [cursor, setCursor] = useState(() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1); });
  const [selected, setSelected] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);

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
    return () => { mounted = false; };
  }, []);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((e) => { if (e.event_date) (map[e.event_date] ||= []).push(e); });
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

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  if (failed) return <p className="text-center py-24 text-muted-foreground">Something went wrong while loading the calendar. Please try again later.</p>;

  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <button onClick={() => setCursor(new Date(year, month - 1, 1))} aria-label="Previous month" className="p-3 text-foreground/70 hover:text-primary transition-colors"><ChevronLeft className="w-5 h-5" /></button>
        <h2 className="font-display font-light text-3xl md:text-4xl text-center">{formatMonthYear(year, month)}</h2>
        <button onClick={() => setCursor(new Date(year, month + 1, 1))} aria-label="Next month" className="p-3 text-foreground/70 hover:text-primary transition-colors"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {isMobile ? (
        monthEvents.length === 0 ? (
          <div className="text-center py-16 border border-border/40 rounded-sm">
            <CalendarDays className="w-10 h-10 text-primary/40 mx-auto mb-4" />
            <p className="text-foreground/70 font-display text-lg">No performances scheduled this month.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {monthEvents.map((e) => {
              const location = formatLocation(e.city, e.state);
              const timeRange = formatTimeRange(e.start_time, e.end_time);
              const [, , dd] = e.event_date.split("-");
              return (
                <button key={e.id} onClick={() => setSelected(e)} className="w-full text-left flex gap-5 p-5 bg-card border border-border/60 rounded-sm hover:border-primary/50 transition-colors">
                  <div className="shrink-0 w-16 text-center border-r border-border/60 pr-4">
                    <p className="font-display text-3xl text-primary leading-none">{Number(dd)}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{formatShortDate(e.event_date).split(" ")[0]}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xl leading-snug mb-1">{e.title}</h3>
                    {e.venue && <p className="text-sm text-foreground/80 truncate">{e.venue}</p>}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                      {location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{location}</span>}
                      {timeRange && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeRange}</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )
      ) : (
        <div className="grid grid-cols-7 gap-px bg-border/40 border border-border/40 rounded-sm overflow-hidden">
          {WEEKDAYS.map((d) => (
            <div key={d} className="bg-secondary/40 text-center py-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{d}</div>
          ))}
          {cells.map((cell, i) => (
            <div key={i} className={`min-h-[110px] bg-card p-2 ${cell ? "" : "bg-secondary/20"}`}>
              {cell && (
                <>
                  <div className={`text-xs mb-1 ${cell.key === todayKey ? "inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>
                    {cell.day}
                  </div>
                  <div className="space-y-1">
                    {cell.evts.slice(0, 2).map((e) => (
                      <button key={e.id} onClick={() => setSelected(e)} className="block w-full text-left px-2 py-1 rounded-sm bg-primary/10 border-l-2 border-primary hover:bg-primary/20 transition-colors">
                        <p className="text-[11px] text-foreground/90 truncate leading-tight">{e.title}</p>
                        {e.start_time && <p className="text-[10px] text-muted-foreground">{formatTimeRange(e.start_time, e.end_time)}</p>}
                      </button>
                    ))}
                    {cell.evts.length > 2 && <p className="text-[10px] text-primary px-2">+{cell.evts.length - 2} more</p>}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {selected && <EventDetailsModal event={selected} onClose={() => setSelected(null)} />}
    </>
  );
}