// ============================================================
// RESUME DATA — Edit this file to add/remove content
// ============================================================

export const personalInfo = {
  name: "Navneet Raj",
  title: "Full-Stack Developer",
  subtitle: "Building beautiful, scalable web experiences",
  email: "navneet78030@gmail.com",
  location: "India",
  resumeUrl: "/resume.pdf",
};

// ============================================================
// PROJECTS
// ============================================================
export interface Project {
  title: string;
  description: string;
  tech: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    title: "College Community Hub - SITCoders",
    description:
      "Full-stack college platform with a multi-tier RBAC system, automated background cleanup, and atomic data management using MongoDB Transactions.",
    tech: ["React", "Tailwind CSS", "Express.js", "MongoDB"],
    image: "/projects/sitcoders.png",
    liveUrl: "https://sitcoders.tech/",
    githubUrl: "https://github.com/mioNacs/SITCoders",
  },
  {
    title: "AI Open Source Companion - Ambria",
    description:
      "AI companion featuring Generative UI for interactive repository management and a human-in-the-loop system for secure GitHub operations.",
    tech: ["Next.js", "Tambo SDK", "Supabase", "Octokit", "TypeScript"],
    image: "/projects/ambria.png",
    liveUrl: "https://ambria.vercel.app", // Replace with your specific deployment link
    githubUrl: "https://github.com/mioNacs/Ambria",
  },
  {
    title: "Coding Profile Aggregator - AayCode",
    description:
      "Platform featuring a normalization engine to sync metrics from GitHub and LeetCode into a unified schema with a high-performance TTL caching layer.",
    tech: ["Next.js", "OAuth", "TypeScript", "MongoDB"],
    image: "/projects/ayycode.png",
    liveUrl: "https://aaycode.vercel.app", // Replace with your specific deployment link
    githubUrl: "https://github.com/mioNacs/AayCode",
  },
];

// ============================================================
// SKILLS
// ============================================================
export interface Skill {
  name: string;
  category: "frontend" | "backend" | "tools" | "other";
  level: number; // 0–100
}

export const skills: Skill[] = [
  { name: "React", category: "frontend", level: 80 },
  { name: "Next.js", category: "frontend", level: 85 },
  { name: "TypeScript", category: "frontend", level: 50 },
  { name: "Tailwind CSS", category: "frontend", level: 85 },
  { name: "Node.js", category: "backend", level: 75 },
  { name: "Express.js", category: "backend", level: 81 },
  { name: "Python", category: "backend", level: 85 },
  { name: "GitHub", category: "tools", level: 90 },
  { name: "gsap", category: "tools", level: 90 },
  { name: "MongoDB", category: "backend", level: 75 },
  { name: "Git", category: "tools", level: 90 },
];

// ============================================================
// COLLEGE PHOTOS
// ============================================================
export interface CollegePhoto {
  src: string;
  caption: string;
}

export const collegePhotos: CollegePhoto[] = [
  {
    src: "/college/photo1.jpg",
    caption: "Strings",
  },
  {
    src: "/college/photo2.jpg",
    caption: "Hackath-one",
  },
  {
    src: "/college/photo3.jpg",
    caption: "hackathon-1-night",
  },
  {
    src: "/college/photo4.jpg",
    caption: "GFG-Patna",
  },
  {
    src: "/college/photo5.jpg",
    caption: "Hackathon-2-presentation",
  },
  {
    src: "/college/photo6.jpg",
    caption: "Hackathon-2-win",
  },
  {
    src: "/college/photo7.jpg",
    caption: "Arttt...",
  },
  {
    src: "/college/photo8.jpg",
    caption: "Parasnath-Trip",
  }
];

// ============================================================
// SOCIAL LINKS
// ============================================================
export interface SocialLink {
  platform: string;
  url: string;
  icon: string; // lucide icon name
}

export const socialLinks: SocialLink[] = [
  { platform: "GitHub", url: "https://github.com/mioNacs", icon: "github" },
  {
    platform: "LinkedIn",
    url: "https://linkedin.com/in/mioNacs",
    icon: "linkedin",
  },
  { platform: "Twitter", url: "https://twitter.com/mioNacs", icon: "twitter" },
  { platform: "Email", url: "mailto:navneet78030@gmail.com", icon: "email" },
];

// ============================================================
// NAV LINKS
// ============================================================
export const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];
