"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/resume-data";
import { Github, ExternalLink } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const container = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".project-card");
      
      ScrollTrigger.create({
        trigger: container.current,
        start: "top top",
        end: `+=${cards.length * 100}%`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const totalProgress = self.progress * (cards.length - 1);
          
          cards.forEach((card, i) => {
            if (i === 0) return;
            
            const cardProgress = Math.max(0, Math.min(1, totalProgress - (i - 1)));
            
            gsap.set(card, {
              yPercent: 100 * (1 - cardProgress),
              opacity: Math.max(0, cardProgress * 2),
            });
            
            if (i > 0) {
              const prevCard = cards[i - 1];
              gsap.set(prevCard, {
                scale: 1 - cardProgress * 0.05,
                filter: `brightness(${1 - cardProgress * 0.2})`,
              });
            }
          });
        },
      });
      
      gsap.set(cards, { yPercent: 100, opacity: 0 });
      gsap.set(cards[0], { yPercent: 0, opacity: 1 });

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} id="projects" className="relative h-screen bg-transparent" style={{ zIndex: 10 }}>
      {/* Chapter Marker - Static Top Left */}
      <div className="absolute top-8 left-6 md:top-24 md:left-12 z-50 pointer-events-none mix-blend-difference accent-text">
        <div className="chapter-number opacity-80">Chapter 03 — Work</div>
        <h2 className="display-heading text-4xl md:text-5xl lg:text-6xl mt-2">
          Selected <span className="opacity-70">Builds.</span>
        </h2>
      </div>

      {/* Cards Container */}
      <div 
        ref={cardsRef} 
        className="w-full h-full relative max-w-[1000px] mx-auto flex items-center justify-center p-4 md:p-6"
      >
        {projects.map((project, i) => (
          <div
            key={i}
            className="project-card absolute top-0 left-0 w-full h-full flex items-center justify-center pt-24 pb-8 px-4 md:pt-0 md:pb-0 md:px-0"
            style={{ zIndex: i + 1 }}
          >
            {/* Card: Vertical Layout (Image Top, Content Bottom) */}
            <div className="w-full h-full max-h-[75vh] md:max-h-[85vh] flex flex-col bg-[var(--bg-card)] rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-strong)]">
              
              {/* Image Area - Flexible height, shows full image */}
              <div className="relative flex-1 bg-[var(--bg-secondary)] overflow-hidden group min-h-[40%] md:min-h-[55%]">
                {/* Browser Header */}
                <div className="absolute top-0 left-0 w-full h-8 bg-black/10 backdrop-blur-md z-10 flex items-center px-4 gap-2 border-b border-[var(--border-light)]">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>

                {/* Full Image - Maximized height */}
                <div className="w-full h-full pt-10 md:pt-12 flex items-center justify-center">
                   <div className="relative w-full h-full shadow-lg overflow-hidden transition-transform duration-700 group-hover:scale-[1.01] bg-white">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-contain object-top" 
                      loading="eager"
                    />
                   </div>
                </div>
              </div>

              {/* Content Area - Bottom */}
              <div className="p-6 md:p-8 flex flex-col justify-between border-t border-[var(--border-light)] bg-[var(--bg-card)] h-auto md:h-[40%]">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-2xl md:text-3xl font-bold leading-tight text-[var(--text-primary)]">
                      {project.title}
                    </h3>
                    <div className="text-5xl font-black text-[var(--border-subtle)] opacity-10 select-none hidden md:block">
                      0{i + 1}
                    </div>
                  </div>

                  <p className="text-[var(--text-secondary)] text-sm md:text-lg leading-relaxed mb-6 line-clamp-3 md:line-clamp-none">
                    {project.description}
                  </p>
                </div>

                <div>
                   {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider bg-[var(--bg-secondary)] border border-[var(--border-medium)] rounded text-[var(--text-secondary)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 rounded bg-[var(--text-primary)] text-[var(--bg-primary)] text-center font-bold uppercase tracking-wider text-xs md:text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        Visit Site <ExternalLink size={14} />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 rounded border border-[var(--border-strong)] text-[var(--text-primary)] text-center font-bold uppercase tracking-wider text-xs md:text-sm hover:bg-[var(--bg-secondary)] transition-colors flex items-center justify-center gap-2"
                      >
                        Source <Github size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Scroll Hint */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in pointer-events-none transition-opacity duration-300">
         {/* Only visible if needed, logic handled by CSS usually or just keep it minimal */}
      </div>
    </section>
  );
}
