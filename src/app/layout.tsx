import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Navneet Raj | Developer Portfolio",
  description:
    "Full-Stack Developer crafting beautiful, performant web experiences with Next.js, React, Three.js, and more.",
  keywords: ["developer", "portfolio", "react", "next.js", "full-stack"],
  authors: [{ name: "Navneet Raj" }],
  openGraph: {
    title: "Navneet Raj | Developer Portfolio",
    description:
      "Full-Stack Developer crafting beautiful, performant web experiences.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {children}
      </body>
    </html>
  );
}
