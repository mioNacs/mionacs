"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills, type Skill } from "@/data/resume-data";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { key: "all", label: "All" },
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "tools", label: "Tools" },
] as const;

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<string>("all");

  const filteredSkills =
    filter === "all" ? skills : skills.filter((s) => s.category === filter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".skill-row",
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Anime.js for progress bars
  useEffect(() => {
    import("animejs").then((anime) => {
      anime.default({
        targets: ".skill-fill",
        width: (el: HTMLElement) => el.getAttribute("data-width") || "0%",
        duration: 1000,
        delay: (_el: HTMLElement, i: number) => i * 60,
        easing: "easeOutExpo",
      });
    });
  }, [filter]);

  return (
    <section
      id="skills"
      ref={sectionRef}
    >
      <div className="section-chapter">
        <div className="chapter-number">Chapter 04 — Skills</div>
        <h2 className="display-heading text-4xl md:text-5xl lg:text-6xl mt-4">
          My <span className="accent-text">toolkit.</span>
        </h2>
        <p className="serif-italic text-lg mt-4 mb-12 max-w-md">
          The technologies and tools I reach for every day.
        </p>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              className={`px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] rounded-sm transition-all duration-300 ${
                filter === cat.key
                  ? "bg-[var(--text-primary)] text-white border-2 border-[var(--text-primary)]"
                  : "bg-transparent text-[var(--text-secondary)] border-2 border-[var(--border-light)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills list — editorial style */}
        <div className="max-w-3xl">
          {filteredSkills.map((skill: Skill) => (
            <div
              key={`${skill.name}-${filter}`}
              className="skill-row flex items-center gap-6 py-5 border-b border-[var(--border-light)]"
            >
              <span className="text-sm font-semibold w-40 flex-shrink-0">
                {skill.name}
              </span>

              <div className="flex-1 h-2 bg-[var(--border-subtle)] rounded-sm overflow-hidden">
                <div
                  className="skill-fill h-full rounded-sm"
                  data-width={`${skill.level}%`}
                  style={{
                    width: "0%",
                    background:
                      skill.level > 85
                        ? "var(--accent-primary)"
                        : skill.level > 70
                        ? "var(--accent-tertiary)"
                        : "var(--text-muted)",
                  }}
                />
              </div>

              <span className="text-xs text-[var(--text-muted)] font-semibold w-10 text-right">
                {skill.level}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
