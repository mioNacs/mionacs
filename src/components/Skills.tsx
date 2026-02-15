"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { skills, type Skill } from "@/data/resume-data";

gsap.registerPlugin(Draggable);

/* ── Skill metadata ── */
const SKILL_META: Record<string, { slug: string; color: string; desc: string }> = {
  "React":          { slug: "react",       color: "#61DAFB", desc: "Component-based UI library. My primary tool for building interfaces." },
  "Next.js":        { slug: "nextdotjs",   color: "#000000", desc: "Full-stack React framework. SSR, routing, API routes — the whole deal." },
  "TypeScript":     { slug: "typescript",  color: "#3178C6", desc: "Type-safe JavaScript. Catches bugs before they ship." },
  "Three.js / R3F": { slug: "threedotjs",  color: "#000000", desc: "3D rendering in the browser. Used for immersive experiences." },
  "GSAP":           { slug: "greensock",   color: "#88CE02", desc: "Professional-grade animation library. Smooth and performant." },
  "Tailwind CSS":   { slug: "tailwindcss", color: "#06B6D4", desc: "Utility-first CSS. Rapid prototyping with consistent design." },
  "Node.js":        { slug: "nodedotjs",   color: "#5FA04E", desc: "Server-side JavaScript runtime. APIs and backend services." },
  "Python":         { slug: "python",      color: "#3776AB", desc: "Scripting, automation, and data processing." },
  "PostgreSQL":     { slug: "postgresql",  color: "#4169E1", desc: "Relational database. Complex queries and data integrity." },
  "MongoDB":        { slug: "mongodb",     color: "#47A248", desc: "NoSQL document database. Flexible schemas." },
  "Git":            { slug: "git",         color: "#F05032", desc: "Version control. Branching, merging, collaboration." },
  "Docker":         { slug: "docker",      color: "#2496ED", desc: "Containerization. Consistent dev-to-prod environments." },
  "Figma":          { slug: "figma",       color: "#F24E1E", desc: "UI/UX design tool. Wireframes to prototypes." },
  "AWS":            { slug: "amazonaws",   color: "#FF9900", desc: "Cloud infrastructure. EC2, S3, Lambda deployments." },
};

function getSuit(cat: string) {
  return cat === "frontend" ? "♦" : cat === "backend" ? "♣" : "♠";
}

/** Small deterministic rotation for "messy stack" feel */
function stackRot(i: number) {
  return (i % 2 === 0 ? 1 : -1) * (i * 0.5);
}

/** Z-index: Index 0 = Top (highest z). */
function stackZ(i: number) {
  return skills.length - i;
}

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const innerEls = useRef<(HTMLDivElement | null)[]>([]);
  const dragRef = useRef<Draggable | null>(null);

  const [swiped, setSwiped] = useState<Set<number>>(new Set());
  const exits = useRef<Map<number, { x: number; y: number; r: number }>>(new Map());
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null);
  const flippedRef = useRef(false);
  const isResetting = useRef(false);
  const [filter, setFilter] = useState<string>("all");

  /* Indices that match the current category filter */
  const filtered = skills.map((_, i) => i).filter(i => filter === "all" || skills[i].category === filter);
  /* Active = filtered AND not swiped */
  const active = filtered.filter(i => !swiped.has(i));
  const topIdx = active.length > 0 ? active[0] : -1;

  /* ── Position cards when filter changes ── */
  useEffect(() => {
    // Reset state on filter change
    setSwiped(new Set());
    exits.current.clear();
    isResetting.current = false;
    setFocusedIdx(null);
    flippedRef.current = false;

    skills.forEach((_, i) => {
      const el = cardEls.current[i];
      if (!el) return;
      const inner = innerEls.current[i];
      if (inner) gsap.set(inner, { rotateY: 0 }); // unflip

      const isInFilter = filter === "all" || skills[i].category === filter;
      if (isInFilter) {
        // Find position within filtered set for z-index
        const filteredIdx = filtered.indexOf(i);
        gsap.set(el, { x: 0, y: 0, rotation: stackRot(filteredIdx), opacity: 1, scale: 1, zIndex: filtered.length - filteredIdx, pointerEvents: "auto" });
      } else {
        gsap.set(el, { opacity: 0, pointerEvents: "none", zIndex: -1 });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  /* ── Draggable + reset logic ── */
  useEffect(() => {
    dragRef.current?.kill();
    dragRef.current = null;

    // All swiped → reset animation
    if (active.length === 0 && swiped.size > 0 && !isResetting.current) {
      isResetting.current = true;

      const timer = setTimeout(() => {
        // Animate each card back from its exit position
        const entries = Array.from(exits.current.entries());
        // Get the swipe order: sort by insertion, which is already in Map order
        entries.forEach(([idx, data], order) => {
          const el = cardEls.current[idx];
          if (!el) return;
          // Animate FROM exit TO stack position
          gsap.fromTo(el,
            { x: data.x, y: data.y, rotation: data.r, opacity: 0, scale: 0.8, zIndex: stackZ(idx) },
            { x: 0, y: 0, rotation: stackRot(idx), opacity: 1, scale: 1, zIndex: stackZ(idx),
              pointerEvents: "auto",
              duration: 0.5, ease: "back.out(1.3)", delay: order * 0.06,
            }
          );
        });

        // After all animations settle, clear state
        setTimeout(() => {
          exits.current.clear();
          isResetting.current = false;
          setSwiped(new Set());
        }, entries.length * 0.06 * 1000 + 600);
      }, 300);

      return () => { clearTimeout(timer); isResetting.current = false; };
    }

    if (topIdx < 0 || focusedIdx !== null) return;

    const el = cardEls.current[topIdx];
    if (!el) return;
    const idx = topIdx;

    const [d] = Draggable.create(el, {
      type: "x,y",
      edgeResistance: 0.5,
      minimumMovement: 6,
      cursor: "grab",
      activeCursor: "grabbing",
      onDrag() {
        gsap.set(this.target, { rotation: this.x * 0.04 });
      },
      onClick() {
        focusCard(idx);
      },
      onDragEnd() {
        if (Math.abs(this.x) > 80 || Math.abs(this.y) > 80) {
          const dX = this.x > 0 ? 1 : -1;
          const dY = this.y > 0 ? 1 : (this.y < 0 ? -1 : 0);
          const ex = dX * 1200;
          const ey = dY !== 0 ? dY * 600 : -200;
          const er = dX * 40;
          exits.current.set(idx, { x: ex, y: ey, r: er });

          gsap.to(this.target, {
            x: ex, y: ey, rotation: er, opacity: 0,
            duration: 0.4, ease: "power2.in",
            onComplete: () => {
              // Hide it and update state
              gsap.set(el, { pointerEvents: "none" });
              setSwiped(prev => new Set([...prev, idx]));
            },
          });
        } else {
          gsap.to(this.target, {
            x: 0, y: 0, rotation: stackRot(idx),
            duration: 0.5, ease: "elastic.out(1, 0.5)",
          });
        }
      },
    });
    dragRef.current = d;
    return () => d.kill();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swiped, focusedIdx, topIdx]);

  /* ── Focus / Flip / Unfocus ── */
  function focusCard(idx: number) {
    setFocusedIdx(idx);
    flippedRef.current = false;
    const el = cardEls.current[idx];
    if (el) {
      gsap.to(el, { x: 0, y: -40, scale: 1.15, rotation: 0, zIndex: 100, duration: 0.4, ease: "back.out(1.2)" });
    }
    // Dim other cards
    skills.forEach((_, i) => {
      if (i !== idx && !swiped.has(i)) {
        const otherEl = cardEls.current[i];
        if (otherEl) {
          gsap.to(otherEl, { opacity: 0.15, filter: "blur(4px) grayscale(100%)", pointerEvents: "none", duration: 0.4 });
        }
      }
    });
  }

  function flipFocused(idx: number) {
    const inner = innerEls.current[idx];
    if (!inner) return;
    flippedRef.current = !flippedRef.current;
    gsap.to(inner, { rotateY: flippedRef.current ? 180 : 0, duration: 0.6, ease: "power2.inOut" });
  }

  function unfocus(idx: number) {
    // Unflip
    const inner = innerEls.current[idx];
    if (inner && flippedRef.current) {
      gsap.to(inner, { rotateY: 0, duration: 0.3, ease: "power2.inOut" });
    }
    // Return focused card
    const el = cardEls.current[idx];
    if (el) {
      gsap.to(el, { x: 0, y: 0, scale: 1, rotation: stackRot(idx), zIndex: stackZ(idx), duration: 0.4, ease: "power2.out" });
    }
    // Restore other cards
    skills.forEach((_, i) => {
      if (i !== idx && !swiped.has(i)) {
        const otherEl = cardEls.current[i];
        if (otherEl) {
          gsap.to(otherEl, { opacity: 1, filter: "blur(0px) grayscale(0%)", pointerEvents: "auto", duration: 0.4 });
        }
      }
    });
    flippedRef.current = false;
    setFocusedIdx(null);
  }

  /* ── Render ── */
  return (
    <section id="skills" ref={containerRef} className="py-32 overflow-hidden min-h-screen flex flex-col items-center justify-center relative bg-transparent">

      <div className="text-center mb-10 z-10">
        <div className="chapter-number pointer-events-none">Chapter 04 — Toolkit</div>
        <h2 className="display-heading text-5xl md:text-6xl text-[var(--text-primary)] pointer-events-none">
          Pick a <span className="accent-text">Card.</span>
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-4 uppercase tracking-widest pointer-events-none">
          Click to flip · Swipe to discard
        </p>

        {/* Category Filters */}
        <div className="flex justify-center gap-2 mt-8">
          {["all", "frontend", "backend", "tools"].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-medium border transition-all duration-300 ${
                filter === cat
                  ? "bg-[var(--accent-primary)] text-[var(--bg-primary)] border-[var(--accent-primary)] shadow-lg"
                  : "bg-transparent text-[var(--text-secondary)] border-[var(--border-light)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Backdrop */}
      {focusedIdx !== null && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => unfocus(focusedIdx)}
        />
      )}

      {/* Card Stack — z-50 so focused cards sit above backdrop z-40 */}
      <div className="relative w-[280px] h-[400px] md:w-[300px] md:h-[420px] z-50" style={{ perspective: "1200px" }}>
        {skills.map((skill, i) => {
          const meta = SKILL_META[skill.name] || { slug: "github", color: "#333", desc: "A useful tool." };
          const iconUrl = `https://cdn.simpleicons.org/${meta.slug}/${meta.color.replace("#", "")}`;
          const suit = getSuit(skill.category);

          return (
            <div
              key={skill.name}
              ref={el => { cardEls.current[i] = el; }}
              onClick={() => {
                if (swiped.has(i)) return;
                if (focusedIdx === i) flipFocused(i);
              }}
              className="absolute top-0 left-0 w-full h-full select-none will-change-transform"
              /* NO inline transform / opacity — GSAP owns these */
            >
              {/* 3D flip wrapper */}
              <div
                ref={el => { innerEls.current[i] = el; }}
                className="w-full h-full relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* ── FRONT ── */}
                <div className="absolute inset-0 rounded-xl shadow-xl border-2 border-[#1a1814] overflow-hidden" style={{ backfaceVisibility: "hidden", background: "#fdfbf7" }}>
                  <div className="w-full h-full p-5 flex flex-col justify-between relative">
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px,transparent 1px)", backgroundSize: "12px 12px" }} />
                    <div className="flex flex-col items-start leading-none z-10">
                      <span className="font-black text-lg">{skill.level}</span>
                      <span className="text-xl" style={{ color: meta.color }}>{suit}</span>
                    </div>
                    <div className="flex flex-col items-center z-10">
                      <div className="w-16 h-16 mb-3">
                        <img src={iconUrl} alt={skill.name} className="w-full h-full object-contain" draggable={false} />
                      </div>
                      <h3 className="text-xl font-bold font-serif text-[#1a1814]">{skill.name}</h3>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#999] mt-1">{skill.category}</p>
                    </div>
                    <div className="flex flex-col items-end leading-none rotate-180 z-10">
                      <span className="font-black text-lg">{skill.level}</span>
                      <span className="text-xl" style={{ color: meta.color }}>{suit}</span>
                    </div>
                  </div>
                </div>

                {/* ── BACK ── */}
                <div className="absolute inset-0 rounded-xl shadow-xl border-2 border-[#1a1814] overflow-hidden" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#1a1814" }}>
                  <div className="w-full h-full p-6 flex flex-col justify-center items-center text-center relative">
                    <div className="absolute inset-3 border border-[#333] rounded-lg pointer-events-none" />
                    <div className="w-10 h-10 mb-4 opacity-60">
                      <img src={iconUrl} alt={skill.name} className="w-full h-full object-contain invert" draggable={false} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{skill.name}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-[200px]">{meta.desc}</p>
                    <div className="mt-6 flex items-center gap-3">
                      <span className="text-xs uppercase tracking-widest text-gray-500">{skill.category}</span>
                      <span className="text-xs font-bold invert" style={{ color: meta.color }}>{skill.level}/100</span>
                    </div>
                    <div className="absolute top-4 right-4 text-2xl opacity-20" style={{ color: meta.color }}>{suit}</div>
                    <div className="absolute bottom-4 left-4 text-2xl opacity-20 rotate-180" style={{ color: meta.color }}>{suit}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty placeholder */}
        <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-[var(--border-light)] rounded-xl" style={{ zIndex: -1 }}>
          <p className="text-sm text-[var(--text-muted)] animate-pulse">Reshuffling…</p>
        </div>
      </div>

      {/* Counter */}
      <div className="mt-8 text-xs text-[var(--text-muted)] uppercase tracking-widest">
        {active.length} / {skills.length} remaining
      </div>
    </section>
  );
}
