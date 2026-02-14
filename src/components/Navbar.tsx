"use client";

import { useState, useEffect, useRef } from "react";
import { navLinks } from "@/data/resume-data";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll progress bar
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });
    }

    // Active section tracking
    const handleScroll = () => {
      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveSection(`#${sections[i]}`);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Scroll Progress */}
      <div
        ref={progressRef}
        className="scroll-progress"
        style={{ transform: "scaleX(0)" }}
      />

      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/90 backdrop-blur-md border-bottom-strong"
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            className="display-heading text-xl tracking-tight"
          >
            NR
            <span className="text-[var(--text-muted)] font-light text-xs ml-1">
              / portfolio
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 border-b-2 ${
                  activeSection === link.href
                    ? "border-[var(--accent-primary)] text-[var(--text-primary)]"
                    : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 border-strong rounded"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[var(--bg-card)] border-t-2 border-[var(--border-strong)] p-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 text-sm font-semibold rounded transition-all ${
                  activeSection === link.href
                    ? "bg-[var(--bg-accent)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
