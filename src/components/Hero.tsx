"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo, socialLinks } from "@/data/resume-data";
import { Github, Linkedin, Twitter, Mail, ArrowDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ReactNode> = {
  github: <Github size={18} />,
  linkedin: <Linkedin size={18} />,
  twitter: <Twitter size={18} />,
  mail: <Mail size={18} />,
};

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax on the massive background text
      gsap.to(bgTextRef.current, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Pin hero and fade out content on scroll
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -80,
        ease: "power2.in",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "70% center",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Staggered entrance
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".hero-line", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15, delay: 0.3 })
        .fromTo(".hero-sub", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
        .fromTo(".hero-cta", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, "-=0.3")
        .fromTo(".hero-social", { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.2");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* Giant background text — parallax */}
      <div
        ref={bgTextRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span
          className="display-heading text-[20vw] leading-none whitespace-nowrap"
          style={{ color: "var(--border-subtle)", opacity: 0.5, letterSpacing: "0.05em" }}
        >
          mioNacs
        </span>
      </div>

      {/* Decorative borders */}
      <div className="absolute top-16 left-6 right-6 bottom-6 border-2 border-[var(--border-light)] rounded-sm pointer-events-none" />

      {/* Content */}
      <div ref={contentRef} className="section-container relative z-10 pt-32 pb-20">
        <div className="max-w-3xl">
          {/* Chapter marker */}
          <div className="chapter-number hero-line opacity-0">
            Prologue
          </div>

          {/* Name */}
          <h1 className="display-heading hero-line opacity-0" style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)" }}>
            {personalInfo.name.split(" ")[0]} <span> </span>
            <span className="accent-text">{personalInfo.name.split(" ").slice(1).join(" ")}</span>
          </h1>

          {/* Role */}
          <p className="hero-line opacity-0 mt-6 text-xl md:text-2xl text-[var(--text-secondary)] max-w-lg leading-relaxed">
            <span className="serif-italic text-2xl md:text-3xl">{personalInfo.title}</span>
          </p>

          <p className="hero-sub opacity-0 mt-4 text-base text-[var(--text-muted)] max-w-md leading-relaxed">
            {personalInfo.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 mt-10">
            <a
              href="#projects"
              className="hero-cta opacity-0 px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white border-0 rounded-sm transition-transform hover:scale-105 active:scale-95"
              style={{ background: "var(--accent-primary)" }}
            >
              View Work
            </a>
            <a
              href="#contact"
              className="hero-cta opacity-0 px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] border-strong rounded-sm transition-all hover:bg-[var(--text-primary)] hover:text-white"
            >
              Contact
            </a>
          </div>

          {/* Socials */}
          <div className="hero-social opacity-0 flex items-center gap-3 mt-12">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border-2 border-[var(--border-strong)] rounded-sm text-[var(--text-secondary)] hover:bg-[var(--text-primary)] hover:text-white hover:border-[var(--text-primary)] transition-all duration-300"
                aria-label={link.platform}
              >
                {iconMap[link.icon] || <Mail size={18} />}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)] animate-float">
        <span className="text-[0.65rem] tracking-[0.3em] uppercase font-semibold">Scroll to begin</span>
        <ArrowDown size={14} />
      </div>
    </section>
  );
}
