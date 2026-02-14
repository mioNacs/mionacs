"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { collegePhotos } from "@/data/resume-data";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function CollegeCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const totalPhotos = collegePhotos.length;
  const angleStep = 360 / totalPhotos;
  const radius = 340;

  const animateTrack = useCallback((newAngle: number) => {
    angleRef.current = newAngle;
    if (trackRef.current) {
      gsap.to(trackRef.current, {
        rotateY: newAngle,
        duration: 0.9,
        ease: "power3.out",
      });
    }
  }, []);

  const rotate = useCallback((direction: "next" | "prev") => {
    const newAngle = direction === "next"
      ? angleRef.current - angleStep
      : angleRef.current + angleStep;
    animateTrack(newAngle);
  }, [angleStep, animateTrack]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section header reveal
      gsap.fromTo(
        ".carousel-header",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Scroll-driven rotation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 30%",
        end: "bottom 70%",
        onUpdate: (self) => {
          const scrollAngle = self.progress * 360 * -1;
          if (trackRef.current) {
            gsap.to(trackRef.current, {
              rotateY: scrollAngle,
              duration: 0.5,
              ease: "power1.out",
              overwrite: "auto",
            });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative overflow-hidden"
    >
      <div className="section-chapter">
        {/* Header — high contrast text */}
        <div className="carousel-header flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-20 opacity-0">
          <div>
            <div
              className="text-xs font-bold tracking-[0.25em] uppercase flex items-center gap-3 mb-3"
              style={{ color: "#e8c860" }}
            >
              Chapter 02 — Memories
              <span className="inline-block w-14 h-[2px]" style={{ background: "#e8c860" }} />
            </div>
            <h2
              className="display-heading text-4xl md:text-5xl lg:text-6xl"
              style={{ color: "#faf8f4" }}
            >
              College{" "}
              <span style={{ color: "#e8c860" }}>Life</span>
            </h2>
            <p
              className="text-lg mt-4 max-w-md italic"
              style={{ color: "rgba(250,248,244,0.55)", fontFamily: "Georgia, serif" }}
            >
              Spin through the moments that shaped who I am.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => rotate("prev")}
              className="w-12 h-12 flex items-center justify-center rounded-sm border-2 transition-all hover:scale-105"
              style={{ borderColor: "#faf8f450", color: "#faf8f4" }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => rotate("next")}
              className="w-12 h-12 flex items-center justify-center rounded-sm border-2 transition-all hover:scale-105"
              style={{ borderColor: "#faf8f450", color: "#faf8f4" }}
              aria-label="Next photo"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* 3D Carousel */}
        <div
          className="mx-auto"
          style={{
            perspective: "1400px",
            perspectiveOrigin: "50% 50%",
            width: "100%",
            height: "520px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            ref={trackRef}
            style={{
              width: "280px",
              height: "400px",
              position: "relative",
              transformStyle: "preserve-3d",
              transform: "rotateY(0deg)",
            }}
          >
            {collegePhotos.map((photo, i) => {
              const angle = i * angleStep;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: "280px",
                    height: "400px",
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  }}
                >
                  {/* ── FRONT FACE (photo + info) ── */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      borderRadius: "6px",
                      overflow: "hidden",
                      border: "2.5px solid #1a1814",
                      display: "flex",
                      flexDirection: "column",
                      // paper texture + glossy sheen
                      background: `
                        linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0.25) 100%),
                        #f8f5ef
                      `,
                      boxShadow: `
                        0 4px 30px rgba(0,0,0,0.15),
                        inset 0 1px 0 rgba(255,255,255,0.6),
                        inset 0 -2px 4px rgba(0,0,0,0.04)
                      `,
                      // subtle bend via skew
                      transform: "perspective(800px) rotateY(-2deg)",
                    }}
                  >
                    {/* Photo area */}
                    <div
                      className="flex-1 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, 
                          hsl(${(i * 50 + 40) % 360}, 18%, 85%), 
                          hsl(${(i * 50 + 100) % 360}, 15%, 78%))`,
                        borderBottom: "2px solid #1a1814",
                      }}
                    >
                      {/* Glossy highlight */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: "-20%",
                          width: "60%",
                          height: "100%",
                          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.1) 50%, transparent 55%)",
                          pointerEvents: "none",
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-sm" style={{ color: "#9e9687" }}>
                        📷 Photo {i + 1}
                      </div>
                    </div>

                    {/* Info strip */}
                    <div className="p-4" style={{ background: "#f8f5ef" }}>
                      <div className="flex items-center gap-2 text-xs font-bold mb-1" style={{ color: "#d4a017" }}>
                        <Calendar size={11} />
                        {photo.date}
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "#5c564b" }}>
                        {photo.caption}
                      </p>
                    </div>
                  </div>

                  {/* ── BACK FACE (paper back) ── */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      borderRadius: "6px",
                      border: "2.5px solid #1a1814",
                      overflow: "hidden",
                      // paper back — linen / aged paper look
                      background: `
                        repeating-linear-gradient(
                          0deg,
                          transparent,
                          transparent 19px,
                          rgba(0,0,0,0.03) 19px,
                          rgba(0,0,0,0.03) 20px
                        ),
                        linear-gradient(135deg, #ece8df 0%, #f4f0e8 50%, #e8e3d8 100%)
                      `,
                      boxShadow: `
                        0 4px 30px rgba(0,0,0,0.12),
                        inset 0 1px 0 rgba(255,255,255,0.4)
                      `,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      // slight opposite bend
                      perspective: "800px",
                    }}
                  >
                    {/* Faint watermark on back */}
                    <div className="text-center" style={{ opacity: 0.15 }}>
                      <div className="display-heading text-5xl" style={{ color: "#1a1814" }}>NR</div>
                      <div className="text-[9px] tracking-[0.3em] uppercase mt-2 font-semibold" style={{ color: "#1a1814" }}>
                        Memory #{i + 1}
                      </div>
                    </div>
                    {/* Tape / corner decoration */}
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        width: "40px",
                        height: "16px",
                        background: "rgba(212, 160, 23, 0.25)",
                        borderRadius: "2px",
                        transform: "rotate(-10deg)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
