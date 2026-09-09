import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail, Lock, Loader2, AlertCircle, Plus, LogOut, Pencil, Trash2,
  CalendarDays, X, Check, AlertTriangle,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { siteConfig, formatDate, formatTimeRange, formatLocation, sortForAdmin } from "@/lib/site";

/* ---------------- Admin Login ---------------- */
export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const returnTo = params.get("returnTo") || "/admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = returnTo;
    } catch (err) {
      setError("Your email or password is incorrect.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src={siteConfig.images.logo} alt="Wade Preston" className="h-14 w-auto mx-auto mb-6 object-contain" />
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary mb-3">Backstage</p>
          <h1 className="font-display font-light text-4xl">Admin Sign In</h1>
        </div>
        <div className="bg-card border border-border/60 rounded-sm p-7 sm:p-9">
          {error && (
            <div role="alert" className="mb-5 flex items-center gap-2 p-3 rounded-sm bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input id="admin-email" type="email" autoComplete="email" autoFocus required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-background border border-border rounded-sm pl-10 pr-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors" />
              </div>
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-background border border-border rounded-sm pl-10 pr-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 text-[11px] uppercase tracking-[0.2em] rounded-sm hover:brass-glow transition-all disabled:opacity-60">
              {loading ? (<><Loader2 className="w-4 h-4 animate-spin" />Signing in...</>) : "Sign In"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-primary transition-colors">Forgot password?</Link>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link to="/" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">← Back to site</Link>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- Event Form Dialog ---------------- */
const EMPTY = { title: "", event_date: "", start_time: "", end_time: "", venue: "", city: "", state: "", address: "", description: "", external_url: "" };

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">{label} {required && <span className="text-primary">*</span>}</label>
      {children}
    </div>
  );
}

function EventFormDialog({ event, onClose, onSaved }) {
  const isEdit = !!event;
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(event ? { ...EMPTY, ...event } : EMPTY); }, [event]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    if (!form.title.trim()) return "Please enter an event name.";
    if (!form.event_date) return "Please select a date.";
    if (form.start_time && form.end_time && form.end_time < form.start_time) return "End time should be after the start time.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }
    setError("");
    setLoading(true);
    const payload = {
      title: form.title.trim(), event_date: form.event_date,
      start_time: form.start_time || "", end_time: form.end_time || "",
      venue: form.venue.trim(), city: form.city.trim(), state: form.state.trim(),
      address: form.address.trim(), description: form.description.trim(),
      external_url: form.external_url.trim(),
    };
    try {
      if (isEdit) await base44.entities.Event.update(event.id, payload);
      else await base44.entities.Event.create(payload);
      setSaved(true);
      setTimeout(onSaved, 700);
    } catch (err) {
      setError("Unable to save the event. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label={isEdit ? "Edit event" : "Add event"}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3 }} className="relative w-full max-w-xl bg-card border border-border rounded-sm shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border/60 px-6 py-5 flex items-center justify-between">
          <h2 className="font-display text-2xl">{isEdit ? "Edit Event" : "Add Event"}</h2>
          <button onClick={onClose} aria-label="Close" className="p-2 text-muted-foreground hover:text-primary transition-colors"><X className="w-5 h-5" /></button>
        </div>
        {saved ? (
          <div className="px-6 py-16 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/15 mb-4"><Check className="w-7 h-7 text-primary" /></div>
            <p className="font-display text-2xl">Event Saved</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            {error && <div role="alert" className="p-3 rounded-sm bg-destructive/10 border border-destructive/30 text-destructive text-sm">{error}</div>}
            <Field label="Event Name" required><input type="text" value={form.title} onChange={set("title")} required autoFocus className="form-input" /></Field>
            <Field label="Date" required><input type="date" value={form.event_date} onChange={set("event_date")} required className="form-input" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Start Time"><input type="time" value={form.start_time} onChange={set("start_time")} className="form-input" /></Field>
              <Field label="End Time"><input type="time" value={form.end_time} onChange={set("end_time")} className="form-input" /></Field>
            </div>
            <Field label="Venue"><input type="text" value={form.venue} onChange={set("venue")} className="form-input" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="City"><input type="text" value={form.city} onChange={set("city")} className="form-input" /></Field>
              <Field label="State"><input type="text" value={form.state} onChange={set("state")} className="form-input" /></Field>
            </div>
            <Field label="Location / Address"><input type="text" value={form.address} onChange={set("address")} className="form-input" /></Field>
            <Field label="Description"><textarea rows={4} value={form.description} onChange={set("description")} className="form-input resize-none" /></Field>
            <p className="text-xs text-muted-foreground">Only Event Name and Date are required. All other fields are optional.</p>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-6 py-3 text-[11px] uppercase tracking-[0.2em] border border-border rounded-sm text-foreground/70 hover:bg-secondary/40 transition-colors">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.2em] bg-primary text-primary-foreground rounded-sm hover:brass-glow transition-all disabled:opacity-60">
                {loading ? (<><Loader2 className="w-4 h-4 animate-spin" />Saving...</>) : "Save Event"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
      <style>{`.form-input{width:100%;background-color:hsl(var(--background));border:1px solid hsl(var(--border));border-radius:var(--radius);padding:.625rem .75rem;color:hsl(var(--foreground));font-size:.9rem}.form-input:focus{outline:none;border-color:hsl(var(--primary))}`}</style>
    </div>
  );
}

/* ---------------- Delete Confirm Dialog ---------------- */
function DeleteConfirmDialog({ event, onCancel, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !deleting && onCancel();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onCancel, deleting]);

  const handleConfirm = async () => { setDeleting(true); await onConfirm(); setDeleting(false); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="alertdialog" aria-modal="true">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onCancel} />
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.25 }} className="relative w-full max-w-md bg-card border border-border rounded-sm shadow-2xl p-7">
        <div className="flex items-start gap-4 mb-6">
          <div className="shrink-0 w-11 h-11 rounded-sm bg-destructive/10 border border-destructive/30 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-destructive" /></div>
          <div>
            <h2 className="font-display text-2xl mb-1">Delete this event?</h2>
            <p className="text-sm text-muted-foreground">Are you sure you want to delete this event? This cannot be undone.</p>
          </div>
        </div>
        <div className="mb-6 p-4 rounded-sm bg-secondary/40 border border-border/60">
          <p className="font-display text-lg leading-snug">{event.title}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatDate(event.event_date)}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={deleting} className="flex-1 px-6 py-3 text-[11px] uppercase tracking-[0.2em] border border-border rounded-sm text-foreground/70 hover:bg-secondary/40 transition-colors disabled:opacity-60">Cancel</button>
          <button onClick={handleConfirm} disabled={deleting} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.2em] bg-destructive text-destructive-foreground rounded-sm hover:opacity-90 transition-all disabled:opacity-60">
            {deleting ? (<><Loader2 className="w-4 h-4 animate-spin" />Deleting...</>) : "Delete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- Admin Dashboard ---------------- */
function EventSection({ title, events, emptyText, onEdit, onDelete, muted }) {
  return (
    <div>
      <h2 className="text-[11px] uppercase tracking-[0.2em] text-primary mb-5">{title}</h2>
      {events.length === 0 ? (
        <p className="text-muted-foreground text-sm py-6">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id} className={`flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-card border border-border/60 rounded-sm ${muted ? "opacity-70" : ""}`}>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-xl leading-snug truncate">{e.title}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-muted-foreground">
                  <span>{formatDate(e.event_date)}</span>
                  {e.venue && <span className="text-foreground/70">· {e.venue}</span>}
                  {formatLocation(e.city, e.state) && <span>· {formatLocation(e.city, e.state)}</span>}
                  {formatTimeRange(e.start_time, e.end_time) && <span>· {formatTimeRange(e.start_time, e.end_time)}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => onEdit(e)} className="inline-flex items-center gap-1.5 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-primary border border-primary/40 rounded-sm hover:bg-primary/10 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />Edit
                </button>
                <button onClick={() => onDelete(e)} className="inline-flex items-center gap-1.5 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-destructive border border-destructive/30 rounded-sm hover:bg-destructive/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    try {
      setFailed(false);
      const all = await base44.entities.Event.list("-event_date", 500);
      setEvents(all);
    } catch (err) {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleLogout = () => base44.auth.logout("/admin/login");
  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (event) => { setEditing(event); setFormOpen(true); };
  const handleSaved = () => { setFormOpen(false); setEditing(null); load(); };
  const handleDelete = async () => {
    if (!deleting) return;
    try { await base44.entities.Event.delete(deleting.id); setDeleting(null); load(); }
    catch (err) { alert("Unable to delete the event. Please try again."); }
  };

  const { upcoming, past } = sortForAdmin(events);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/60">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={siteConfig.images.logo} alt="Wade Preston" className="h-10 w-auto object-contain" />
            <div className="hidden sm:block">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary">Backstage</p>
              <h1 className="font-display text-xl leading-none">Wade's Dashboard</h1>
            </div>
          </div>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-foreground/70 hover:text-primary transition-colors px-4 py-2 border border-border/60 rounded-sm">
            <LogOut className="w-4 h-4" />Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center"><CalendarDays className="w-6 h-6 text-primary" /></div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Upcoming Events</p>
              <p className="font-display text-3xl leading-none mt-1">{loading ? "—" : upcoming.length}</p>
            </div>
          </div>
          <button onClick={openAdd} className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 text-[11px] uppercase tracking-[0.2em] rounded-sm hover:brass-glow transition-all">
            <Plus className="w-4 h-4" />Add Event
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : failed ? (
          <div className="text-center py-20">
            <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-4" />
            <p className="text-foreground/80">Something went wrong while loading your events. Please try again.</p>
            <button onClick={load} className="mt-4 text-[11px] uppercase tracking-[0.2em] text-primary hover:underline">Try again</button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border/60 rounded-sm">
            <CalendarDays className="w-10 h-10 text-primary/40 mx-auto mb-4" />
            <p className="font-display text-2xl mb-2">No upcoming events.</p>
            <p className="text-muted-foreground text-sm">Add an event to get started.</p>
          </div>
        ) : (
          <div className="space-y-10">
            <EventSection title="Upcoming Events" events={upcoming} emptyText="No upcoming events. Add an event to get started." onEdit={openEdit} onDelete={setDeleting} />
            {past.length > 0 && <EventSection title="Past Events" events={past} emptyText="" onEdit={openEdit} onDelete={setDeleting} muted />}
          </div>
        )}
      </main>

      <button onClick={openAdd} aria-label="Add event" className="fixed bottom-6 right-6 z-40 md:hidden w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg brass-glow">
        <Plus className="w-6 h-6" />
      </button>

      {formOpen && <EventFormDialog event={editing} onClose={() => { setFormOpen(false); setEditing(null); }} onSaved={handleSaved} />}
      {deleting && <DeleteConfirmDialog event={deleting} onCancel={() => setDeleting(null)} onConfirm={handleDelete} />}
    </div>
  );
}