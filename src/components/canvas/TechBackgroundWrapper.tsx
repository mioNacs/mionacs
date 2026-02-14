"use client";

import dynamic from "next/dynamic";

const TechBackground = dynamic(
  () => import("@/components/canvas/TechBackground"),
  { ssr: false }
);

export default function TechBackgroundWrapper() {
  return <TechBackground />;
}
