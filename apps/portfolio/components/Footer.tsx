import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 mt-12 relative z-10">
      <div className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
        <div className="flex items-center gap-4">
          <a
            href="mailto:hoang.tran02@base.vn"
            className="hover:text-zinc-300 transition-colors flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Contact me
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} Huang Workspace. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-zinc-300 transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <a href="#" className="hover:text-zinc-300 transition-colors">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="#" className="hover:text-zinc-300 transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
