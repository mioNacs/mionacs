"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo, socialLinks } from "@/data/resume-data";
import { Send, Github, Linkedin, Twitter, Mail, CheckCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ReactNode> = {
  github: <Github size={18} />,
  linkedin: <Linkedin size={18} />,
  twitter: <Twitter size={18} />,
  mail: <Mail size={18} />,
};

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Anime.js for input focus
  useEffect(() => {
    import("animejs").then((anime) => {
      const inputs = document.querySelectorAll(".storytelling-input");
      inputs.forEach((input) => {
        input.addEventListener("focus", () => {
          anime.default({
            targets: input,
            borderColor: "#d4a017",
            duration: 300,
            easing: "easeOutCubic",
          });
        });
        input.addEventListener("blur", () => {
          anime.default({
            targets: input,
            borderColor: "#1a1814",
            duration: 300,
            easing: "easeOutCubic",
          });
        });
      });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "YOUR_ACCESS_KEY",
          name: formState.name,
          email: formState.email,
          message: formState.message,
          subject: `Portfolio Contact from ${formState.name}`,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormState({ name: "", email: "", message: "" });
      }
    } catch {
      // Silent error handling
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef}>
      <div className="section-chapter">
        <div className="contact-reveal chapter-number opacity-0">
          Epilogue — Contact
        </div>
        <h2 className="contact-reveal display-heading text-4xl md:text-5xl lg:text-6xl mt-4 opacity-0">
          Let&apos;s write the
          <br />
          <span className="accent-text">next chapter.</span>
        </h2>
        <p className="contact-reveal serif-italic text-lg mt-4 mb-16 max-w-md opacity-0">
          Have a project in mind? I&apos;d love to hear from you.
        </p>

        <div className="grid md:grid-cols-2 gap-16 max-w-4xl">
          {/* Form */}
          <div className="contact-reveal opacity-0">
            {submitted ? (
              <div className="story-card text-center py-12">
                <CheckCircle
                  size={40}
                  className="mx-auto mb-4"
                  style={{ color: "var(--accent-primary)" }}
                />
                <h3 className="display-heading text-xl mb-2">Message Sent!</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  I&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2 block">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    className="storytelling-input w-full px-0 py-3 bg-transparent text-[var(--text-primary)] text-base border-0 border-b-2 border-[var(--border-strong)] placeholder:text-[var(--text-muted)] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    className="storytelling-input w-full px-0 py-3 bg-transparent text-[var(--text-primary)] text-base border-0 border-b-2 border-[var(--border-strong)] placeholder:text-[var(--text-muted)] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2 block">
                    Message
                  </label>
                  <textarea
                    placeholder="Tell me about your project..."
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    className="storytelling-input w-full px-0 py-3 bg-transparent text-[var(--text-primary)] text-base border-0 border-b-2 border-[var(--border-strong)] placeholder:text-[var(--text-muted)] focus:outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="mt-4 flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white rounded-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  style={{ background: "var(--accent-primary)" }}
                >
                  <Send size={14} />
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="contact-reveal flex flex-col justify-center gap-10 opacity-0">
            <div>
              <h3 className="display-heading text-lg mb-3">Get in touch</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                I&apos;m always open to new opportunities, collaborations, and
                interesting conversations about technology.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">
                Email
              </p>
              <a
                href={`mailto:${personalInfo.email}`}
                className="text-base font-semibold accent-text hover:underline"
              >
                {personalInfo.email}
              </a>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-3">
                Social
              </p>
              <div className="flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center border-2 border-[var(--border-strong)] rounded-sm text-[var(--text-secondary)] hover:bg-[var(--text-primary)] hover:text-white hover:border-[var(--text-primary)] transition-all duration-300"
                    aria-label={link.platform}
                  >
                    {iconMap[link.icon] || <Mail size={18} />}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
