"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Github,
  Linkedin,
  ChevronDown,
  Send,
} from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
import { cn } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";
import type { QA, ExperienceItem, Profile } from "@/lib/content/types";

interface Props {
  qas: QA[];
  experience: ExperienceItem[];
  profile: Profile;
  bioHtml: string;
}

export default function AboutClient({ qas, experience, profile, bioHtml }: Props) {
  const [openQA, setOpenQA] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState("bio");

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [contactError, setContactError] = useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("sending");
    setContactError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setContactStatus("error");
        setContactError(data.error || "Đã có lỗi xảy ra");
        return;
      }
      setContactStatus("sent");
      setContactForm({ name: "", email: "", message: "" });
    } catch {
      setContactStatus("error");
      setContactError("Không thể kết nối, vui lòng thử lại");
    }
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <PageTransition>
      <div className="pt-12 md:pt-20 flex flex-col md:flex-row gap-12 relative">
        {/* Sidebar */}
        <aside className="md:w-48 shrink-0">
          <nav className="sticky top-24 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
            {[
              { id: "bio", label: "Bio" },
              { id: "career", label: "Career" },
              { id: "qa", label: "Q&A" },
              { id: "connect", label: "Connect" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleScroll(e, item.id)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  activeSection === item.id
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 space-y-24 max-w-2xl">
          {/* Bio */}
          <section id="bio" className="scroll-mt-24 space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold tracking-tight text-zinc-100"
            >
              About Me
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="prose prose-invert prose-zinc max-w-none text-zinc-400 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: bioHtml }}
            />
          </section>

          {/* Career */}
          <section id="career" className="scroll-mt-24 space-y-8">
            <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">Career</h2>
            <div className="space-y-8 border-l border-white/10 ml-3 pl-8 relative">
              {experience.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="absolute -left-[39px] top-1.5 w-3 h-3 rounded-full bg-zinc-800 border-2 border-zinc-400" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-medium text-zinc-200">{item.role}</h3>
                    <span className="text-sm font-medium text-zinc-500 bg-zinc-900/50 px-2 py-1 rounded-md w-fit">
                      {item.period}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-zinc-400 mb-3">{item.company}</div>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Q&A */}
          <section id="qa" className="scroll-mt-24 space-y-8">
            <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">Q&amp;A</h2>
            <div className="space-y-3">
              {qas.map((qa, index) => (
                <motion.div
                  key={qa.slug || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-zinc-900/30 border border-white/5 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenQA(openQA === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-zinc-900/50 transition-colors"
                  >
                    <span className="text-base font-medium text-zinc-200">
                      {qa.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-zinc-500 transition-transform duration-300 shrink-0 ml-4",
                        openQA === index && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {openQA === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="p-5 pt-0 text-sm text-zinc-400 leading-relaxed border-t border-white/5">
                          {qa.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Connect */}
          <section id="connect" className="scroll-mt-24 space-y-8">
            <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">Connect</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                {[
                  profile.email && { href: `mailto:${profile.email}`, icon: <Mail className="w-5 h-5" />, label: "Email" },
                  profile.social.github && { href: profile.social.github, icon: <Github className="w-5 h-5" />, label: "GitHub" },
                  profile.social.facebook && { href: profile.social.facebook, icon: <FacebookIcon className="w-5 h-5" />, label: "Facebook" },
                  profile.social.linkedin && { href: profile.social.linkedin, icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn" },
                ].filter(Boolean).map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-800 transition-colors group"
                  >
                    <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      {link.icon}
                    </span>
                    <span className="font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>

              <form
                className="space-y-4 bg-zinc-900/30 border border-white/5 p-6 rounded-2xl"
                onSubmit={handleContactSubmit}
              >
                <h3 className="text-lg font-medium text-zinc-200 mb-4">Send a message</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                    maxLength={100}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                    maxLength={254}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Message</label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all resize-none"
                    placeholder="How can I help you?"
                    maxLength={2000}
                    required
                  />
                </div>

                {contactStatus === "error" && (
                  <p className="text-sm text-red-400">{contactError}</p>
                )}
                {contactStatus === "sent" && (
                  <p className="text-sm text-emerald-400">Gửi thành công! Cảm ơn bạn đã liên hệ.</p>
                )}

                <button
                  type="submit"
                  disabled={contactStatus === "sending"}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-100 text-zinc-900 hover:bg-white font-medium px-4 py-2.5 rounded-lg transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {contactStatus === "sending" ? "Đang gửi..." : "Send Message"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
