"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STORY_CARDS = [
  {
    num: "01",
    title: "The 'Hello World' Moment",
    text: "It wasn't pretty. My first website was a mess of bright red backgrounds and scrolling marquee text. But it was mine. That feeling of creating something from nothing — addictive.",
  },
  {
    num: "02",
    title: "Embracing the Chaos",
    text: "College is chaos. Exams, assignments, and late nights debugging. Next.js became my tool of choice to balance academic life with my true passion: building modern, scalable web apps.",
  },
  {
    num: "03",
    title: "What's Next?",
    text: "I'm looking for a place to grow. A team where I can contribute, learn, and break things (in a dev environment, hopefully). I bring hunger, curiosity, and code that ships.",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".depth-card");
      const totalCards = cards.length;

      /* ── Master timeline pinned to scroll ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${(totalCards + 1) * 100}%`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      /* ── Intro: Title flies in ── */
      tl.fromTo(
        ".about-title-word",
        { y: 120, opacity: 0, rotateX: -40 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.1,
          ease: "power3.out",
          duration: 0.5,
        }
      );

      /* ── Subtitle fade ── */
      tl.fromTo(
        ".about-subtitle",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
        "-=0.2"
      );

      /* ── Hold the intro for a beat ── */
      tl.to({}, { duration: 0.3 });

      /* ── Cycle through cards ── */
      cards.forEach((card, i) => {
        // Card enters from deep in Z-space
        tl.fromTo(
          card,
          {
            z: -800,
            opacity: 0,
            rotateY: -15,
            scale: 0.7,
            filter: "blur(8px)",
          },
          {
            z: 0,
            opacity: 1,
            rotateY: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power2.out",
          }
        );

        // Animate the inner content elements on arrival
        tl.fromTo(
          card.querySelectorAll(".card-inner > *"),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.3,
            ease: "power2.out",
          },
          "-=0.3"
        );

        // Hold the card in view
        tl.to({}, { duration: 0.5 });

        // Card exits (except the last one holds longer)
        if (i < totalCards - 1) {
          tl.to(card, {
            z: 300,
            opacity: 0,
            rotateY: 10,
            scale: 1.1,
            filter: "blur(4px)",
            duration: 0.5,
            ease: "power2.in",
          });
        }
      });

      /* ── Rotating Badge ── */
      gsap.to(".about-badge", {
        rotation: 360,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
        },
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative h-screen bg-transparent overflow-hidden"
      style={{ zIndex: 20 }}
    >
      {/* Perspective Stage */}
      <div
        ref={stageRef}
        className="w-full h-full flex items-center justify-center"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 50%" }}
      >
        {/* ── Chapter & Title Layer ── */}
        <div className="absolute top-12 left-6 md:top-16 md:left-16 z-30">
          <div className="chapter-number mb-4">Chapter 01 — About</div>
          <h2 className="display-heading text-5xl md:text-6xl lg:text-8xl leading-[1] overflow-hidden">
            <span className="about-title-word inline-block mr-3" style={{ transformStyle: "preserve-3d" }}>
              Just
            </span>
            <span className="about-title-word inline-block accent-text italic" style={{ transformStyle: "preserve-3d" }}>
              Start.
            </span>
          </h2>
          <p className="about-subtitle text-lg md:text-xl text-[var(--text-secondary)] mt-4 max-w-md leading-relaxed">
            No fancy titles. No corporate buzzwords. <br className="hidden md:block" />
            Just a student obsessed with turning
            <span className="font-mono text-sm bg-[var(--bg-secondary)] px-2 py-0.5 rounded mx-1 border border-[var(--border-light)]">
              coffee
            </span>
            into code.
          </p>
        </div>

        {/* ── Rotating Badge ── */}
        <div className="about-badge absolute bottom-12 left-6 md:bottom-16 md:left-16 z-30 opacity-40">
          <svg viewBox="0 0 100 100" className="w-28 h-28 text-[var(--text-muted)]">
            <path
              id="aboutBadgePath"
              d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              fill="transparent"
            />
            <text fontSize="10.5" letterSpacing="2.5" fill="currentColor">
              <textPath href="#aboutBadgePath" startOffset="0%">
                EXPLORE • CREATE • LEARN • REPEAT •
              </textPath>
            </text>
          </svg>
        </div>

        {/* ── 3D Card Stage ── */}
        <div
          className="relative w-full max-w-[700px] h-full flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {STORY_CARDS.map((card, i) => (
            <div
              key={i}
              className="depth-card absolute w-full px-4 md:px-0"
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform, opacity, filter",
                opacity: 0,
              }}
            >
              <div className="card-inner bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                {/* Big number watermark */}
                <div className="absolute -top-4 -right-2 text-[120px] md:text-[160px] font-black text-[var(--border-subtle)] opacity-10 leading-none select-none pointer-events-none">
                  {card.num}
                </div>

                {/* Content */}
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--text-primary)] leading-tight">
                  {card.title}
                </h3>

                <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
                  {card.text}
                </p>

                {/* Decorative bottom bar */}
                <div className="mt-8 flex gap-2">
                  <div className="h-1 flex-1 bg-[var(--accent-primary)] rounded-full opacity-60" />
                  <div className="h-1 w-8 bg-[var(--border-light)] rounded-full" />
                  <div className="h-1 w-4 bg-[var(--border-light)] rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
