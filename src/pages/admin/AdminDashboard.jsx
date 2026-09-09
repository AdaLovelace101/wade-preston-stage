import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { siteConfig } from "@/lib/siteConfig";
import { formatDate, formatTimeRange, formatLocation, sortForAdmin } from "@/lib/eventUtils";
import { Plus, LogOut, Loader2, Pencil, Trash2, CalendarDays, AlertCircle } from "lucide-react";
import EventFormDialog from "@/components/admin/EventFormDialog";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";

export default function AdminDashboard() {
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

  useEffect(() => {
    load();
  }, [load]);

  const handleLogout = () => {
    base44.auth.logout("/admin/login");
  };

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (event) => {
    setEditing(event);
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    setEditing(null);
    load();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await base44.entities.Event.delete(deleting.id);
      setDeleting(null);
      load();
    } catch (err) {
      alert("Unable to delete the event. Please try again.");
    }
  };

  const { upcoming, past } = sortForAdmin(events);
  const upcomingCount = upcoming.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/60">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={siteConfig.images.logo}
              alt="Wade Preston"
              className="h-10 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <p className="text-[10px] uppercase tracking-playbill text-primary">
                Backstage
              </p>
              <h1 className="font-display text-xl leading-none">Wade's Dashboard</h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-playbill text-foreground/70 hover:text-primary transition-colors px-4 py-2 border border-border/60 rounded-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
        {/* Stats + add */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-playbill text-muted-foreground">
                Upcoming Events
              </p>
              <p className="font-display text-3xl leading-none mt-1">
                {loading ? "—" : upcomingCount}
              </p>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 text-[11px] uppercase tracking-playbill rounded-sm hover:brass-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : failed ? (
          <div className="text-center py-20">
            <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-4" />
            <p className="text-foreground/80">
              Something went wrong while loading your events. Please try again.
            </p>
            <button
              onClick={load}
              className="mt-4 text-[11px] uppercase tracking-playbill text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border/60 rounded-sm">
            <CalendarDays className="w-10 h-10 text-primary/40 mx-auto mb-4" />
            <p className="font-display text-2xl mb-2">No upcoming events.</p>
            <p className="text-muted-foreground text-sm">
              Add an event to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            <EventSection
              title="Upcoming Events"
              events={upcoming}
              emptyText="No upcoming events. Add an event to get started."
              onEdit={openEdit}
              onDelete={setDeleting}
            />
            {past.length > 0 && (
              <EventSection
                title="Past Events"
                events={past}
                emptyText=""
                onEdit={openEdit}
                onDelete={setDeleting}
                muted
              />
            )}
          </div>
        )}
      </main>

      {/* Floating action button */}
      <button
        onClick={openAdd}
        aria-label="Add event"
        className="fixed bottom-6 right-6 z-40 md:hidden w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg brass-glow"
      >
        <Plus className="w-6 h-6" />
      </button>

      {formOpen && (
        <EventFormDialog
          event={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSaved={handleSaved}
        />
      )}

      {deleting && (
        <DeleteConfirmDialog
          event={deleting}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function EventSection({ title, events, emptyText, onEdit, onDelete, muted }) {
  return (
    <div>
      <h2 className="text-[11px] uppercase tracking-playbill text-primary mb-5">
        {title}
      </h2>
      {events.length === 0 ? (
        <p className="text-muted-foreground text-sm py-6">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div
              key={e.id}
              className={`flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-card border border-border/60 rounded-sm ${
                muted ? "opacity-70" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-xl leading-snug truncate">
                  {e.title}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-muted-foreground">
                  <span>{formatDate(e.event_date)}</span>
                  {e.venue && <span className="text-foreground/70">· {e.venue}</span>}
                  {formatLocation(e.city, e.state) && (
                    <span>· {formatLocation(e.city, e.state)}</span>
                  )}
                  {formatTimeRange(e.start_time, e.end_time) && (
                    <span>· {formatTimeRange(e.start_time, e.end_time)}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onEdit(e)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[11px] uppercase tracking-playbill text-primary border border-primary/40 rounded-sm hover:bg-primary/10 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(e)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[11px] uppercase tracking-playbill text-destructive border border-destructive/30 rounded-sm hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}