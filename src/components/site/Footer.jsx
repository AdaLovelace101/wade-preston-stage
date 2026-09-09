import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Music2, Mail } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Calendar", to: "/calendar" },
  { label: "Contact", to: "/contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const s = siteConfig.social;
  const socials = [
    { url: s.instagram, icon: Instagram, label: "Instagram" },
    { url: s.facebook, icon: Facebook, label: "Facebook" },
    { url: s.youtube, icon: Youtube, label: "YouTube" },
    { url: s.tiktok, icon: Music2, label: "TikTok" },
  ].filter((item) => item.url);

  return (
    <footer className="bg-background border-t border-border/60 mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <img
              src={siteConfig.images.logo}
              alt="Wade Preston"
              className="h-12 w-auto mb-5 object-contain"
            />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {siteConfig.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-playbill text-primary mb-5">
              Explore
            </h3>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-foreground/75 hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-playbill text-primary mb-5">
              Connect
            </h3>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="flex items-center gap-2 text-sm text-foreground/75 hover:text-primary transition-colors mb-4"
            >
              <Mail className="w-4 h-4" />
              {siteConfig.contactEmail}
            </a>
            {socials.length > 0 && (
              <div className="flex items-center gap-4">
                {socials.map((item) => (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="text-foreground/60 hover:text-primary transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <Link
            to="/admin"
            className="text-[11px] uppercase tracking-playbill text-muted-foreground/60 hover:text-primary transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}