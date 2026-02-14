import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import CollegeCarousel from "@/components/CollegeCarousel";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import TechBackgroundWrapper from "@/components/canvas/TechBackgroundWrapper";

export default function Home() {
  return (
    <>
      {/* Persistent 3D background — fixed, behind everything */}
      <TechBackgroundWrapper />

      {/* Foreground content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />
        <Hero />
        <About />
        <CollegeCarousel />
        <Projects />
        <Skills />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
