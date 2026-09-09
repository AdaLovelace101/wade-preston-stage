import React from "react";
import { motion } from "framer-motion";
import CalendarView from "@/components/site/CalendarView";

export default function CalendarPage() {
  return (
    <div className="pt-32 pb-24">
      <section className="max-w-5xl mx-auto px-6 lg:px-10 mb-14 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[11px] uppercase tracking-playbill text-primary mb-5"
        >
          Calendar
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-light text-5xl md:text-7xl leading-[0.95] text-balance"
        >
          Where You Can See Wade
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-muted-foreground mt-6 max-w-xl mx-auto leading-relaxed"
        >
          Browse upcoming performances by month. Select any event to see venue,
          time, and ticket details.
        </motion.p>
      </section>

      <section className="max-w-5xl mx-auto px-6 lg:px-10">
        <CalendarView />
      </section>
    </div>
  );
}