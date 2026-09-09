import React from "react";
import Hero from "@/components/site/Hero";
import AboutSection from "@/components/site/AboutSection";
import UpcomingEvents from "@/components/site/UpcomingEvents";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <UpcomingEvents />
    </>
  );
}