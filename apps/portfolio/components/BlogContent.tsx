"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

/**
 * Lightbox with zoom/pan support.
 * Lives OUTSIDE the dangerouslySetInnerHTML tree
 * so its state changes never cause the HTML container to re-render.
 */
function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const imgRef = useRef<HTMLDivElement>(null);

  const zoomIn = useCallback(() => setScale((s) => Math.min(s * 1.4, 5)), []);
  const zoomOut = useCallback(() => {
    setScale((s) => {
      const next = Math.max(s / 1.4, 1);
      if (next <= 1) setTranslate({ x: 0, y: 0 });
      return next;
    });
  }, []);
  const resetZoom = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "=" || e.key === "+") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") resetZoom();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, zoomIn, zoomOut, resetZoom]);

  // Mouse wheel zoom
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [zoomIn, zoomOut]);

  // Pan handlers (mouse drag when zoomed)
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (scale <= 1) return;
      e.preventDefault();
      dragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [scale]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      setTranslate((t) => ({ x: t.x + dx, y: t.y + dy }));
    },
    []
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  // Double-click to toggle zoom
  const onDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (scale > 1) resetZoom();
      else setScale(2.5);
    },
    [scale, resetZoom]
  );

  // Click backdrop to close (only if not zoomed)
  const onBackdropClick = useCallback(() => {
    if (scale <= 1) onClose();
  }, [scale, onClose]);

  return (
    <div className="blog-lightbox" onClick={onBackdropClick}>
      {/* Controls */}
      <div className="blog-lightbox-controls" onClick={(e) => e.stopPropagation()}>
        <button className="blog-lightbox-btn" onClick={zoomIn} title="Zoom in (+)">
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="blog-lightbox-zoom-label">{Math.round(scale * 100)}%</span>
        <button className="blog-lightbox-btn" onClick={zoomOut} title="Zoom out (-)">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button className="blog-lightbox-btn" onClick={resetZoom} title="Reset (0)">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <button className="blog-lightbox-close" onClick={onClose}>
        <X className="w-6 h-6" />
      </button>

      {/* Image with transform */}
      <div
        ref={imgRef}
        className="blog-lightbox-img-wrap"
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          cursor: scale > 1 ? "grab" : "zoom-in",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={onDoubleClick}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="blog-lightbox-img"
          draggable={false}
        />
      </div>

      {alt && <p className="blog-lightbox-caption">{alt}</p>}
    </div>
  );
}

/**
 * Static HTML renderer — never re-renders after mount.
 * Uses event delegation so no DOM mutation needed for images.
 */
function HtmlRenderer({
  html,
  className,
  onImageClick,
}: {
  html: string;
  className?: string;
  onImageClick: (src: string, alt: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Enhance <pre> blocks with copy + download (runs once)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Wrap tables in scroll container for mobile
    container.querySelectorAll("table").forEach((table) => {
      if (table.parentElement?.classList.contains("table-scroll-wrapper")) return;
      const wrapper = document.createElement("div");
      wrapper.className = "table-scroll-wrapper";
      table.parentNode!.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    container.querySelectorAll("pre").forEach((pre) => {
      if (pre.querySelector(".code-actions")) return;
      pre.style.position = "relative";

      const code = pre.querySelector("code");
      const text = code?.textContent ?? pre.textContent ?? "";
      const langClass = code?.className
        .split(/\s+/)
        .find((c) => c.startsWith("language-"));
      const lang = langClass?.replace("language-", "") ?? "";

      const toolbar = document.createElement("div");
      toolbar.className = "code-actions";
      toolbar.innerHTML = `
        ${lang ? `<span class="code-lang">${lang}</span>` : ""}
        <div class="code-buttons">
          <button class="code-btn code-copy" title="Copy code">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>Copy</span>
          </button>
          <button class="code-btn code-download" title="Download code">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Download</span>
          </button>
        </div>
      `;

      const copyBtn = toolbar.querySelector(".code-copy")!;
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(text).then(() => {
          const orig = copyBtn.innerHTML;
          copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>Copied!</span>`;
          copyBtn.classList.add("code-btn-success");
          setTimeout(() => {
            copyBtn.innerHTML = orig;
            copyBtn.classList.remove("code-btn-success");
          }, 2000);
        });
      });

      toolbar.querySelector(".code-download")!.addEventListener("click", () => {
        const ext = getExtension(lang);
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `code.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
      });

      pre.insertBefore(toolbar, pre.firstChild);
    });
  }, [html]);

  // Event delegation for image clicks — no DOM mutation needed
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const img = (e.target as HTMLElement).closest(
        ".blog-content img"
      ) as HTMLImageElement | null;
      if (!img) return;
      e.preventDefault();
      onImageClick(img.src, img.alt || "");
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [html, onImageClick]);

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function BlogContent({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const [lightbox, setLightbox] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const handleImageClick = useCallback((src: string, alt: string) => {
    setLightbox({ src, alt });
  }, []);

  const handleClose = useCallback(() => {
    setLightbox(null);
  }, []);

  return (
    <>
      <HtmlRenderer
        html={html}
        className={className}
        onImageClick={handleImageClick}
      />

      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={handleClose}
        />
      )}
    </>
  );
}

function getExtension(lang: string): string {
  const map: Record<string, string> = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    ruby: "rb",
    rust: "rs",
    golang: "go",
    go: "go",
    bash: "sh",
    shell: "sh",
    sh: "sh",
    zsh: "sh",
    css: "css",
    html: "html",
    json: "json",
    yaml: "yml",
    yml: "yml",
    sql: "sql",
    java: "java",
    kotlin: "kt",
    swift: "swift",
    cpp: "cpp",
    c: "c",
    php: "php",
    dockerfile: "Dockerfile",
    xml: "xml",
    markdown: "md",
    md: "md",
    toml: "toml",
    ini: "ini",
    nginx: "conf",
  };
  return map[lang] ?? "txt";
}
