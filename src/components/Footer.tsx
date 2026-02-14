"use client";

import { socialLinks } from "@/data/resume-data";

export default function Footer() {
  return (
    <footer className="border-t-2 border-[var(--border-strong)] py-10">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="display-heading text-sm">
          mioNacs <span className="text-[var(--text-muted)] font-light">/ portfolio</span>
        </p>

        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
            >
              {link.platform}
            </a>
          ))}
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} — Built with Next.js, GSAP & R3F
        </p>
      </div>
    </footer>
  );
}
