"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { collegePhotos } from "@/data/resume-data";

gsap.registerPlugin(ScrollTrigger);

const CARD_HEIGHT = 420;
const CARD_GAP = 100; // overlap gap between cards

export default function CollegeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0); // track active without re-render for scroll

  const animate = useCallback((newActive: number) => {
    const stage = stageRef.current;
    if (!stage) return;

    const cards = stage.querySelectorAll<HTMLElement>(".coverflow-card");

    cards.forEach((card, i) => {
      const distance = i - newActive;
      const absDistance = Math.abs(distance);

      // Position: active card at center (x=0), others offset by gap
      const x = distance * CARD_GAP;

      // Rotation: left cards face right, right cards face left
      let rotateY = 0;
      if (distance < 0) rotateY = 45;
      else if (distance > 0) rotateY = -45;

      // Depth: further cards are pushed back
      const z = distance === 0 ? 0 : -Math.abs(distance) * 50;

      // z-index: active on top
      const zIndex = 100 - absDistance;

      // Brightness: active is bright, others dimmed
      const brightness = distance === 0 ? 1 : 0.45;

      gsap.to(card, {
        x: x,
        z: z,
        rotationY: rotateY,
        zIndex: zIndex,
        duration: 0.5,
        ease: "power2.out",
      });

      // Separate filter animation for better perf
      gsap.to(card.querySelector(".card-img-wrapper"), {
        filter: `brightness(${brightness})`,
        duration: 0.4,
        ease: "power2.out",
      });

      // Show/hide caption based on active
      const caption = card.querySelector(".card-caption");
      if (caption) {
        gsap.to(caption, {
          opacity: distance === 0 ? 1 : 0,
          y: distance === 0 ? 0 : 10,
          duration: 0.3,
        });
      }
    });
  }, []);

  // Scroll-driven navigation: pin section, scrub through photos
  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    // Initial render
    animate(0);

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      // Slow scroll: 80vh per photo
      end: `+=${collegePhotos.length * 80}vh`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      onUpdate: (self) => {
        // Map scroll progress (0-1) to photo index
        const newIndex = Math.round(self.progress * (collegePhotos.length - 1));
        if (newIndex !== activeRef.current) {
          activeRef.current = newIndex;
          setActiveIndex(newIndex);
          animate(newIndex);
        }
      },
    });

    return () => st.kill();
  }, [animate]);

  // Also animate on click (activeIndex state change)
  useEffect(() => {
    activeRef.current = activeIndex;
    animate(activeIndex);
  }, [activeIndex, animate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setActiveIndex((p) => Math.max(0, p - 1));
      if (e.key === "ArrowRight") setActiveIndex((p) => Math.min(collegePhotos.length - 1, p + 1));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <section
      id="gallery"
      ref={containerRef}
      className="relative py-32 overflow-hidden h-screen flex flex-col justify-center items-center bg-transparent"
      style={{ zIndex: 15 }}
    >
      {/* Chapter Marker */}
      <div className="absolute top-20 left-6 md:left-12 z-50 pointer-events-none mix-blend-difference">
        <div className="chapter-number text-white/50">Chapter 02 — Memories</div>
        <h2
              className="display-heading text-4xl md:text-5xl lg:text-6xl accent-text"
            >
              Carousel
            </h2>
      </div>

      {/* 3D Coverflow Stage */}
      <div
        ref={stageRef}
        className="relative flex items-center justify-center"
        style={{
          perspective: "1000px",
          width: "100%",
          height: `${CARD_HEIGHT + 800}px`,
        }}
      >
        {collegePhotos.map((photo, i) => (
          <div
            key={i}
            className="coverflow-card absolute cursor-pointer"
            onClick={() => setActiveIndex(i)}
            style={{
              height: `${CARD_HEIGHT}px`,
              transformStyle: "preserve-3d",
              marginLeft: `-0px`,
              // WebkitBoxReflect:
              //   "below 4px linear-gradient(to top, rgba(255,255,255,0.15), transparent 60%)",
            }}
          >
            {/* Image */}
            <div className="card-img-wrapper w-full h-full overflow-hidden rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] bg-black">
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
              />
            </div>

            {/* Caption + Date (below the card) */}
            <div
              className="card-caption text-center mt-3 opacity-0"
              style={{ transform: "translateY(10px)" }}
            >
              <p className="text-black/80 font-bold text-md mt-0.5" style={{letterSpacing: "1px"}}>{photo.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
