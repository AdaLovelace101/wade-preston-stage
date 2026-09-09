// Central site content + date/time helpers. Edit biography, contact, social, and imagery here.
// Dates are treated as calendar dates (no timezone conversion) to prevent day shifts.

export const siteConfig = {
  name: "Wade Preston",
  tagline: "Broadway Performer • Musician • Entertainer",
  contactEmail: "booking@wadepreston.com",
  social: {
    instagram: "",
    facebook: "",
    youtube: "",
    tiktok: "",
    other: "",
  },
  images: {
    logo: "https://media.base44.com/images/public/6aa0c5fbc3510c28c50ec986/f21a491fa_logo.jpg",
    hero: "https://media.base44.com/images/public/6aa0c5fbc3510c28c50ec986/66c3f6036_wade.jpg",
    aboutMain: "https://media.base44.com/images/public/6aa0c5fbc3510c28c50ec986/96b2fa39f_wade3.jpg",
    aboutSecondary: "https://media.base44.com/images/public/6aa0c5fbc3510c28c50ec986/282853f0b_wade2.jpg",
    piano: "https://media.base44.com/images/public/6aa0c5fbc3510c28c50ec986/28fdfcfe3_wadepiano.jpg",
  },
  bio: [
    "Wade Preston is a Broadway performer, musician, and entertainer known for bringing the music of Billy Joel to life on stage. With a commanding presence at the piano and a voice built for the theater, he has spent his career channeling the spirit of classic American rock and roll into unforgettable live performances.",
    "From intimate club sets to full-scale theatrical productions, Wade's shows celebrate the songs that define a generation — delivered with the precision of a virtuoso and the soul of a storyteller. Every performance is a conversation between the keys and the crowd, equal parts virtuosity and heart.",
    "This is placeholder biography copy. It can be updated at any time from the site content settings.",
  ],
  aboutExtra: [
    "Career highlights and additional details can be added here — notable productions, venues, collaborations, and milestones from Wade's career on stage and in the studio.",
  ],
};

export function todayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function formatShortDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatMonthYear(year, month) {
  return new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
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