import React from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/siteConfig";
import { Image } from "@/components/ui/image";

export default function About() {
  return (
    <div className="pt-28">
      {/* Hero portrait */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <Image
          src={siteConfig.images.hero}
          alt="Wade Preston performing"
          fittingType="fill"
          focalPointX={0.35}
          focalPointY={0.4}
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/30" />
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-10 pb-12">
          <div className="max-w-7xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-[11px] uppercase tracking-playbill text-primary mb-4"
            >
              About
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display font-light text-5xl md:text-7xl lg:text-8xl leading-[0.95]"
            >
              Wade Preston
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Biography */}
      <section className="py-24 md:py-32 max-w-3xl mx-auto px-6 lg:px-10">
        <div className="space-y-6">
          {siteConfig.bio.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="text-foreground/80 leading-[1.8] text-lg"
            >
              {p}
            </motion.p>
          ))}
        </div>
      </section>

      {/* Secondary portrait + extra info */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative aspect-[4/5] overflow-hidden rounded-sm"
          >
            <Image
              src={siteConfig.images.aboutSecondary}
              alt="Portrait of Wade Preston"
              fittingType="fill"
              focalPointX={0.5}
              focalPointY={0.4}
              className="w-full h-full"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display font-light text-3xl md:text-4xl mb-6">
              Career & Highlights
            </h2>
            {siteConfig.aboutExtra.map((p, i) => (
              <p key={i} className="text-foreground/75 leading-[1.7] mb-4">
                {p}
              </p>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}