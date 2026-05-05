"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import {
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Columns2,
  Square,
  RotateCw,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// react-pdf is client-only — load it dynamically to avoid SSR
const Document = dynamic(
  () => import("react-pdf").then((m) => m.Document),
  { ssr: false }
);
const Page = dynamic(
  () => import("react-pdf").then((m) => m.Page),
  { ssr: false }
);

// Configure pdf.js worker once on client
if (typeof window !== "undefined") {
  // Lazy-load on first import; setup happens inside CvViewer effect.
}

const A4_WIDTH_PX = 794; // 210mm @ 96dpi
const ZOOM_STEPS = [0.5, 0.6, 0.75, 0.85, 1, 1.15, 1.3, 1.5, 1.75, 2, 2.5, 3];

interface Props {
  fileUrl: string;
  fileName: string;
}

export default function CvViewer({ fileUrl, fileName }: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [split, setSplit] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [containerWidth, setContainerWidth] = useState<number>(A4_WIDTH_PX);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // pdf.js worker setup
  useEffect(() => {
    (async () => {
      const { pdfjs } = await import("react-pdf");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    })();
  }, []);

  // Resize observer to make pages responsive
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      setContainerWidth(w);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pageWidth = useMemo(() => {
    const padding = 32; // breathing room for shadows
    const cols = split ? 2 : 1;
    const gap = split ? 16 : 0;
    const available = Math.max(200, containerWidth - padding - gap);
    const fitWidth = available / cols;
    // Default fills the toolbar zone; zoom scales but never exceeds available width per column
    return Math.min(fitWidth * zoom, fitWidth);
  }, [containerWidth, zoom, split]);

  const onDocLoad = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const zoomIn = () => {
    const idx = ZOOM_STEPS.findIndex((z) => z >= zoom);
    setZoom(ZOOM_STEPS[Math.min(ZOOM_STEPS.length - 1, idx + 1)] ?? zoom);
  };
  const zoomOut = () => {
    const idx = ZOOM_STEPS.findIndex((z) => z >= zoom);
    setZoom(ZOOM_STEPS[Math.max(0, idx - 1)] ?? zoom);
  };
  const fitPage = () => setZoom(1);

  const pages = useMemo(
    () => Array.from({ length: numPages }, (_, i) => i + 1),
    [numPages]
  );

  return (
    <div className="pt-8 md:pt-12 flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-zinc-900/60 border border-white/10 rounded-xl backdrop-blur">
        <div className="text-xs text-zinc-400 px-2 select-none tabular-nums">
          {numPages ? `${numPages} page${numPages > 1 ? "s" : ""}` : "–"}
        </div>

        <Divider />

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <ToolbarBtn onClick={zoomOut} title="Zoom out">
            <ZoomOut className="w-4 h-4" />
          </ToolbarBtn>
          <span className="text-xs text-zinc-400 w-12 text-center select-none tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          <ToolbarBtn onClick={zoomIn} title="Zoom in">
            <ZoomIn className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn onClick={fitPage} title="Fit page (A4)">
            <Maximize2 className="w-4 h-4" />
          </ToolbarBtn>
        </div>

        <Divider />

        {/* Layout */}
        <ToolbarBtn
          onClick={() => setSplit((s) => !s)}
          title={split ? "Single page" : "Split (2 columns)"}
          active={split}
        >
          {split ? <Square className="w-4 h-4" /> : <Columns2 className="w-4 h-4" />}
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => setRotation((r) => (r + 90) % 360)}
          title="Rotate"
        >
          <RotateCw className="w-4 h-4" />
        </ToolbarBtn>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Open</span>
          </a>
          <a
            href={fileUrl}
            download={fileName}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 text-zinc-900 hover:bg-white transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* Viewer */}
      <div ref={containerRef}>
        {error ? (
          <div className="h-full flex items-center justify-center text-zinc-400 text-sm p-8">
            {error}
          </div>
        ) : (
          <Document
            file={fileUrl}
            onLoadSuccess={onDocLoad}
            onLoadError={(e: Error) => {
              setError(`Không tải được PDF: ${e.message}`);
              setLoading(false);
            }}
            loading={<Loading />}
            className={cn(
              "py-6 px-4 flex flex-wrap justify-center gap-4",
              split ? "items-start" : "flex-col items-center"
            )}
          >
            {!loading &&
              pages.map((p) => (
                <div
                  key={p}
                  className="shadow-lg shadow-black/40 bg-white"
                  style={{
                    aspectRatio: rotation % 180 === 0 ? "210/297" : "297/210",
                  }}
                >
                  <Page
                    pageNumber={p}
                    width={pageWidth}
                    rotate={rotation}
                    renderTextLayer
                    renderAnnotationLayer
                    loading={<Loading />}
                  />
                </div>
              ))}
          </Document>
        )}
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center p-12 text-zinc-500 text-sm gap-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      Đang tải PDF...
    </div>
  );
}

function Divider() {
  return <span className="h-5 w-px bg-white/10 mx-1" />;
}

function ToolbarBtn({
  children,
  onClick,
  disabled,
  title,
  active,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-1.5 rounded-md transition-colors text-zinc-400",
        "hover:bg-zinc-800 hover:text-zinc-200",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
        active && "bg-zinc-800 text-zinc-100"
      )}
    >
      {children}
    </button>
  );
}
