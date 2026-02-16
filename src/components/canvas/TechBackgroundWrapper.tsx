"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const TechBackground = dynamic(
  () => import("@/components/canvas/TechBackground"),
  { ssr: false }
);

export default function TechBackgroundWrapper() {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if device is mobile
    const checkMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Don't render on server or on mobile devices
  if (!isClient || isMobile) {
    return null;
  }

  return <TechBackground />;
}
