import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Check } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { Image } from "@/components/ui/image";
import { Hero, AboutSection, UpcomingEvents, CalendarView } from "@/components/Public";

/* ---------------- Home ---------------- */
export function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <UpcomingEvents />
    </>
  );
}

/* ---------------- About ---------------- */
export function About() {
  return (
    <div className="pt-28">
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <Image src={siteConfig.images.hero} alt="Wade Preston performing" fittingType="fill" focalPointX={0.35} focalPointY={0.4} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/30" />
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-10 pb-12">
          <div className="max-w-7xl mx-auto">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-[11px] uppercase tracking-[0.2em] text-primary mb-4">About</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="font-display font-light text-5xl md:text-7xl lg:text-8xl leading-[0.95]">Wade Preston</motion.h1>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 max-w-3xl mx-auto px-6 lg:px-10">
        <div className="space-y-6">
          {siteConfig.bio.map((p, i) => (
            <motion.p key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.05 }} className="text-foreground/80 leading-[1.8] text-lg">{p}</motion.p>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative aspect-[4/5] overflow-hidden rounded-sm">
            <Image src={siteConfig.images.aboutSecondary} alt="Portrait of Wade Preston" fittingType="fill" focalPointX={0.5} focalPointY={0.4} className="w-full h-full" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <h2 className="font-display font-light text-3xl md:text-4xl mb-6">Career & Highlights</h2>
            {siteConfig.aboutExtra.map((p, i) => (
              <p key={i} className="text-foreground/75 leading-[1.7] mb-4">{p}</p>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- Calendar ---------------- */
export function CalendarPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="max-w-5xl mx-auto px-6 lg:px-10 mb-14 text-center">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-[11px] uppercase tracking-[0.2em] text-primary mb-5">Calendar</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-display font-light text-5xl md:text-7xl leading-[0.95] text-balance">Where You Can See Wade</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.25 }} className="text-muted-foreground mt-6 max-w-xl mx-auto leading-relaxed">
          Browse upcoming performances by month. Select any event to see venue, time, and location details.
        </motion.p>
      </section>
      <section className="max-w-5xl mx-auto px-6 lg:px-10">
        <CalendarView />
      </section>
    </div>
  );
}

/* ---------------- Contact ---------------- */
export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Website inquiry from ${name || "a visitor"}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${siteConfig.contactEmail}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="pt-32 pb-24">
      <section className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-[11px] uppercase tracking-[0.2em] text-primary mb-5">Contact</p>
            <h1 className="font-display font-light text-5xl md:text-6xl leading-[0.95] mb-8 text-balance">Get in touch</h1>
            <p className="text-foreground/75 leading-[1.7] mb-8 max-w-md">
              For inquiries about performances, press, or professional opportunities, send a message and it will reach Wade's team directly.
            </p>
            <a href={`mailto:${siteConfig.contactEmail}`} className="inline-flex items-center gap-3 text-primary hover:text-primary/80 transition-colors group">
              <Mail className="w-5 h-5" />
              <span className="text-lg font-display">{siteConfig.contactEmail}</span>
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="bg-card border border-border/60 rounded-sm p-7 sm:p-9">
            {sent ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/15 mb-5"><Check className="w-7 h-7 text-primary" /></div>
                <h2 className="font-display text-2xl mb-2">Message ready</h2>
                <p className="text-muted-foreground text-sm">
                  Your email app should have opened with the message pre-filled. If not, email{" "}
                  <a href={`mailto:${siteConfig.contactEmail}`} className="text-primary">{siteConfig.contactEmail}</a>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Name</label>
                  <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-background border border-border rounded-sm px-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Email</label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-background border border-border rounded-sm px-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Message</label>
                  <textarea id="message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required className="w-full bg-background border border-border rounded-sm px-4 py-3 text-foreground focus:border-primary focus:outline-none transition-colors resize-none" />
                </div>
                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 text-[11px] uppercase tracking-[0.2em] rounded-sm hover:brass-glow transition-all">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}