import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { isValidUrl } from "@/lib/eventUtils";

const EMPTY = {
  title: "",
  event_date: "",
  start_time: "",
  end_time: "",
  venue: "",
  city: "",
  state: "",
  address: "",
  description: "",
  external_url: "",
};

export default function EventFormDialog({ event, onClose, onSaved }) {
  const isEdit = !!event;
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (event) {
      setForm({ ...EMPTY, ...event });
    } else {
      setForm(EMPTY);
    }
  }, [event]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    if (!form.title.trim()) return "Please enter an event name.";
    if (!form.event_date) return "Please select a date.";
    if (form.external_url && !isValidUrl(form.external_url))
      return "Please enter a valid link (starting with http:// or https://).";
    if (form.start_time && form.end_time && form.end_time < form.start_time)
      return "End time should be after the start time.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError("");
    setLoading(true);

    const payload = {
      title: form.title.trim(),
      event_date: form.event_date,
      start_time: form.start_time || "",
      end_time: form.end_time || "",
      venue: form.venue.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      address: form.address.trim(),
      description: form.description.trim(),
      external_url: form.external_url.trim(),
    };

    try {
      if (isEdit) {
        await base44.entities.Event.update(event.id, payload);
      } else {
        await base44.entities.Event.create(payload);
      }
      setSaved(true);
      setTimeout(onSaved, 700);
    } catch (err) {
      setError("Unable to save the event. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Edit event" : "Add event"}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-xl bg-card border border-border rounded-sm shadow-2xl max-h-[92vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-card border-b border-border/60 px-6 py-5 flex items-center justify-between">
          <h2 className="font-display text-2xl">
            {isEdit ? "Edit Event" : "Add Event"}
          </h2>
          <button onClick={onClose} aria-label="Close" className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {saved ? (
          <div className="px-6 py-16 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/15 mb-4">
              <Check className="w-7 h-7 text-primary" />
            </div>
            <p className="font-display text-2xl">Event Saved</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            {error && (
              <div role="alert" className="p-3 rounded-sm bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                {error}
              </div>
            )}

            <Field label="Event Name" required>
              <input
                type="text"
                value={form.title}
                onChange={set("title")}
                required
                autoFocus
                className="form-input"
              />
            </Field>

            <Field label="Date" required>
              <input
                type="date"
                value={form.event_date}
                onChange={set("event_date")}
                required
                className="form-input"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Start Time">
                <input type="time" value={form.start_time} onChange={set("start_time")} className="form-input" />
              </Field>
              <Field label="End Time">
                <input type="time" value={form.end_time} onChange={set("end_time")} className="form-input" />
              </Field>
            </div>

            <Field label="Venue">
              <input type="text" value={form.venue} onChange={set("venue")} className="form-input" />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="City">
                <input type="text" value={form.city} onChange={set("city")} className="form-input" />
              </Field>
              <Field label="State">
                <input type="text" value={form.state} onChange={set("state")} className="form-input" />
              </Field>
            </div>

            <Field label="Location / Address">
              <input type="text" value={form.address} onChange={set("address")} className="form-input" />
            </Field>

            <Field label="Description">
              <textarea
                rows={4}
                value={form.description}
                onChange={set("description")}
                className="form-input resize-none"
              />
            </Field>

            <Field label="External Link (tickets / event page)">
              <input
                type="url"
                value={form.external_url}
                onChange={set("external_url")}
                placeholder="https://"
                className="form-input"
              />
            </Field>

            <p className="text-xs text-muted-foreground">
              Only Event Name and Date are required. All other fields are optional.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 text-[11px] uppercase tracking-playbill border border-border rounded-sm text-foreground/70 hover:bg-secondary/40 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-[11px] uppercase tracking-playbill bg-primary text-primary-foreground rounded-sm hover:brass-glow transition-all disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Event"
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>

      <style>{`
        .form-input {
          width: 100%;
          background-color: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: var(--radius);
          padding: 0.625rem 0.75rem;
          color: hsl(var(--foreground));
          font-size: 0.9rem;
        }
        .form-input:focus {
          outline: none;
          border-color: hsl(var(--primary));
        }
        .form-input::placeholder { color: hsl(var(--muted-foreground)); }
      `}</style>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-playbill text-muted-foreground mb-2">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
    </div>
  );
}