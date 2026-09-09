import React from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/siteConfig";
import { Image } from "@/components/ui/image";

export default function AboutSection() {
  return (
    <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 lg:px-10">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative">
          
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
            <Image
              src={siteConfig.images.aboutMain}
              alt="Portrait of Wade Preston"
              fittingType="fill"
              focalPointX={0.5}
              focalPointY={0.4}
              className="w-full h-full" />
            
          </div>
          <div className="hidden md:block absolute -bottom-6 -right-6 w-40 h-40 overflow-hidden rounded-sm border border-border/60 opacity-90">
            <Image
              src={siteConfig.images.piano}
              alt="Wade Preston at the piano"
              fittingType="fill"
              className="w-full h-full hidden" />
            
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}>
          
          <p className="text-[11px] uppercase tracking-playbill text-primary mb-5">
            About
          </p>
          <h2 className="font-display font-light text-4xl md:text-5xl lg:text-6xl leading-tight mb-8 text-balance">
            A virtuoso at the keys. A storyteller on stage.
          </h2>
          <div className="space-y-5">
            {siteConfig.bio.map((p, i) =>
            <p key={i} className="text-foreground/75 leading-[1.7] text-[15px]">
                {p}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>);

}