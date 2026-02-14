"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { collegePhotos } from "@/data/resume-data";

gsap.registerPlugin(ScrollTrigger);

const CARD_WIDTH = 320;
const CARD_HEIGHT = 420;
const CARD_GAP = 100; // overlap gap between cards

export default function CollegeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
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
    >
      {/* Chapter Marker */}
      <div className="absolute top-12 left-6 md:left-12 z-50 pointer-events-none mix-blend-difference">
        <div className="chapter-number text-white/50">Chapter 02 — Memories</div>
        <h2
              className="display-heading text-4xl md:text-5xl lg:text-6xl"
              style={{ color: "#faf8f4" }}
            >
              College{" "}
              <span style={{ color: "#e8c860" }}>Life</span>
            </h2>
      </div>

      {/* 3D Coverflow Stage */}
      <div
        ref={stageRef}
        className="relative flex items-center justify-center"
        style={{
          perspective: "900px",
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
              width: `${CARD_WIDTH}px`,
              height: `${CARD_HEIGHT}px`,
              transformStyle: "preserve-3d",
              left: "50%",
              marginLeft: `-${CARD_WIDTH / 2}px`,
              WebkitBoxReflect:
                "below 4px linear-gradient(to bottom, rgba(255,255,255,0.15), transparent 70%)",
            }}
          >
            {/* Image */}
            <div className="card-img-wrapper w-full h-full overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)] bg-black">
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
              <p className="text-white text-sm font-medium truncate">
                {photo.caption}
              </p>
              <p className="text-white/40 text-xs mt-0.5">{photo.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
