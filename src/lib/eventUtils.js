// Date/time helpers. Dates are treated as calendar dates (no timezone conversion)
// to prevent day shifts. Times are stored as 24h "HH:MM" strings.

export function todayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatMonthYear(year, month) {
  return new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  if (isNaN(h)) return timeStr;
  const period = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m || 0).padStart(2, "0")} ${period}`;
}

export function formatTimeRange(start, end) {
  if (!start && !end) return "";
  if (start && end) return `${formatTime(start)} – ${formatTime(end)}`;
  return formatTime(start || end);
}

export function formatLocation(city, state) {
  return [city, state].filter(Boolean).join(", ");
}

export function isUpcoming(event) {
  return (event.event_date || "") >= todayStr();
}

export function sortForAdmin(events) {
  const today = todayStr();
  const upcoming = events
    .filter((e) => (e.event_date || "") >= today)
    .sort((a, b) => (a.event_date || "").localeCompare(b.event_date || ""));
  const past = events
    .filter((e) => (e.event_date || "") < today)
    .sort((a, b) => (b.event_date || "").localeCompare(a.event_date || ""));
  return { upcoming, past };
}

export function isValidUrl(url) {
  if (!url) return true;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}