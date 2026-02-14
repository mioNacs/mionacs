"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/data/resume-data";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax background shape
      gsap.to(".about-shape", {
        yPercent: -40,
        rotation: 15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Reveal words one by one
      const words = document.querySelectorAll(".reveal-word");
      gsap.fromTo(
        words,
        { opacity: 0.1 },
        {
          opacity: 1,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "center 40%",
            scrub: 1,
          },
        }
      );

      // Stats slide in
      gsap.fromTo(
        ".about-stat",
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-stats-grid",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split bio into words for reveal effect
  const bioWords = personalInfo.bio.split(" ");

  return (
    <section id="about" ref={sectionRef} className="relative overflow-hidden">
      {/* Parallax decorative shape */}
      <div
        className="about-shape absolute -right-20 top-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ border: "3px solid var(--border-light)", opacity: 0.4 }}
      />
      <div
        className="about-shape absolute -left-16 bottom-32 w-60 h-60 pointer-events-none"
        style={{ border: "3px solid var(--accent-primary)", opacity: 0.15, borderRadius: "4px", transform: "rotate(-12deg)" }}
      />

      <div className="section-chapter relative z-10">
        <div className="chapter-number">Chapter 01 — About</div>

        <div className="grid md:grid-cols-5 gap-16 items-start mt-12">
          {/* Left — big text reveal */}
          <div className="md:col-span-3">
            <h2 className="display-heading text-4xl md:text-5xl lg:text-6xl mb-10">
              The <span className="accent-text">story</span> behind
              <br />the code.
            </h2>

            <p className="text-lg md:text-xl leading-[1.8] text-[var(--text-secondary)]">
              {bioWords.map((word, i) => (
                <span key={i} className="reveal-word inline-block mr-[0.3em]" style={{ opacity: 0.1 }}>
                  {word}
                </span>
              ))}
            </p>
          </div>

          {/* Right — stats */}
          <div className="md:col-span-2 about-stats-grid flex flex-col gap-6 mt-4">
            {[
              { value: "20+", label: "Projects shipped" },
              { value: "3+", label: "Years of experience" },
              { value: "∞", label: "Curiosity level" },
            ].map((stat, i) => (
              <div
                key={i}
                className="about-stat story-card flex items-center gap-6 opacity-0"
              >
                <span
                  className="display-heading text-4xl accent-text"
                  style={{ minWidth: "70px" }}
                >
                  {stat.value}
                </span>
                <span className="text-sm text-[var(--text-secondary)] uppercase tracking-[0.1em] font-semibold">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
