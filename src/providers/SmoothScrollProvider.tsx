"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    console.log("SmoothScrollProvider: Initializing Lenis");
    
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;
    console.log("SmoothScrollProvider: Lenis initialized", lenis);

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", (e) => {
      ScrollTrigger.update();
    });

    // Use GSAP ticker to update Lenis
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    console.log("SmoothScrollProvider: Connected to GSAP ticker");

    // Refresh ScrollTrigger after a short delay to ensure proper initialization
    // and after images/content load
    let refreshTimeout: NodeJS.Timeout;
    const refreshScrollTrigger = () => {
      refreshTimeout = setTimeout(() => {
        console.log("SmoothScrollProvider: Refreshing ScrollTrigger");
        ScrollTrigger.refresh();
      }, 100);
    };

    refreshScrollTrigger();
    
    // Also refresh on window load to handle any lazy-loaded content
    window.addEventListener("load", refreshScrollTrigger);

    // Cleanup
    return () => {
      console.log("SmoothScrollProvider: Cleaning up");
      clearTimeout(refreshTimeout);
      window.removeEventListener("load", refreshScrollTrigger);
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
    };
  }, []);

  return <>{children}</>;
}
