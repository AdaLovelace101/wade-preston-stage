import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { Image } from "@/components/ui/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={siteConfig.images.piano}
          alt="Wade Preston at the piano"
          fittingType="fill"
          focalPointX={0.5}
          focalPointY={0.5}
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full pt-28 pb-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[11px] md:text-xs uppercase tracking-playbill text-primary mb-6"
        >
          {siteConfig.tagline}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
          className="font-display font-light text-[clamp(3.5rem,11vw,9rem)] leading-[0.95] text-foreground text-balance"
        >
          Wade
          <br />
          Preston
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
          className="mt-10"
        >
          <Link
            to="/calendar"
            className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-[11px] uppercase tracking-playbill font-medium rounded-sm hover:brass-glow transition-all duration-300"
          >
            See Where Wade Is Performing
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}