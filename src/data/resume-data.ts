// ============================================================
// RESUME DATA — Edit this file to add/remove content
// ============================================================

export const personalInfo = {
  name: "Navneet Raj",
  title: "Full-Stack Developer",
  subtitle: "Building beautiful, performant web experiences",
  email: "navneet78030@gmail.com",
  location: "India",
  bio: "Final year student exploring the depths of full-stack development. I learn by building, breaking, and fixing things.",
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
  { name: "React", category: "frontend", level: 95 },
  { name: "Next.js", category: "frontend", level: 90 },
  { name: "TypeScript", category: "frontend", level: 88 },
  { name: "Three.js / R3F", category: "frontend", level: 75 },
  { name: "GSAP", category: "frontend", level: 80 },
  { name: "Tailwind CSS", category: "frontend", level: 92 },
  { name: "Node.js", category: "backend", level: 85 },
  { name: "Python", category: "backend", level: 78 },
  { name: "PostgreSQL", category: "backend", level: 80 },
  { name: "MongoDB", category: "backend", level: 75 },
  { name: "Git", category: "tools", level: 90 },
  { name: "Docker", category: "tools", level: 70 },
  { name: "Figma", category: "tools", level: 72 },
  { name: "AWS", category: "tools", level: 65 },
];

// ============================================================
// COLLEGE PHOTOS
// ============================================================
export interface CollegePhoto {
  src: string;
  date: string;
  caption: string;
}

export const collegePhotos: CollegePhoto[] = [
  {
    src: "/college/photo1.jpg",
    date: "August 2021",
    caption: "First day at college — new beginnings!",
  },
  {
    src: "/college/photo2.jpg",
    date: "January 2022",
    caption: "Hackathon night — 36 hours of coding",
  },
  {
    src: "/college/photo3.jpg",
    date: "March 2022",
    caption: "Tech fest with the squad",
  },
  {
    src: "/college/photo4.jpg",
    date: "October 2022",
    caption: "Cultural night celebrations",
  },
  {
    src: "/college/photo5.jpg",
    date: "February 2023",
    caption: "Project presentation day",
  },
  {
    src: "/college/photo6.jpg",
    date: "May 2023",
    caption: "Farewell vibes — end of an era",
  },
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
  { platform: "GitHub", url: "https://github.com/navneet", icon: "github" },
  {
    platform: "LinkedIn",
    url: "https://linkedin.com/in/navneet",
    icon: "linkedin",
  },
  { platform: "Twitter", url: "https://twitter.com/navneet", icon: "twitter" },
  { platform: "Email", url: "mailto:navneet@example.com", icon: "mail" },
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
