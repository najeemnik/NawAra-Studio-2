import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ShieldCheck, 
  Maximize, 
  Minimize, 
  Sparkles, 
  Layers, 
  Camera, 
  Eye, 
  Lock,
  Download
} from 'lucide-react';
import { Language, ProjectImage } from '../types';

interface ProtectedImageViewerProps {
  image: ProjectImage;
  projectName: string;
  lang: Language;
  onClose?: () => void;
}

export default function ProtectedImageViewer({ image, projectName, lang, onClose }: ProtectedImageViewerProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [selectedRes, setSelectedRes] = useState<'8K UHD' | '4K UHD' | '2K HD'>('8K UHD');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWatermark, setShowWatermark] = useState(true);
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const isFa = lang === 'fa';
  const isPs = lang === 'ps';

  // Handle right click or save attempt
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSecurityAlert(true);
    setTimeout(() => setShowSecurityAlert(false), 3000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsPanning(true);
      dragStartRef.current = { x: e.clientX - panPos.x, y: e.clientY - panPos.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoomLevel > 1) {
      setPanPos({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.002;
    setZoomLevel((prev) => Math.min(Math.max(1, prev + delta), 5));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      id="protected-8k-viewer"
      onContextMenu={handleContextMenu}
      onWheel={handleWheel}
      className={`relative w-full h-[600px] sm:h-[720px] bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl flex flex-col select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : ''
      }`}
    >
      {/* Top Header HUD */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-neutral-950/90 via-neutral-950/50 to-transparent backdrop-blur-sm z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="font-bold tracking-wider">{selectedRes}</span>
            <span className="text-[10px] bg-neutral-900/80 px-1.5 py-0.5 rounded text-neutral-400">
              {isFa ? 'محافظت شده' : isPs ? 'خوندي' : 'Protected'}
            </span>
          </div>

          <div className="text-xs text-neutral-300 hidden md:block">
            <span className="text-neutral-500">|</span> <span className="font-semibold">{projectName}</span>
          </div>
        </div>

        {/* Resolution selector */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex bg-neutral-900/90 border border-neutral-800 rounded-lg p-1 text-xs">
            {(['2K HD', '4K UHD', '8K UHD'] as const).map((res) => (
              <button
                key={res}
                id={`btn-res-${res.replace(/\s+/g, '')}`}
                type="button"
                onClick={() => setSelectedRes(res)}
                className={`px-2.5 py-1 rounded-md transition-all font-mono font-medium ${
                  selectedRes === res
                    ? 'bg-amber-500 text-neutral-950 shadow-sm font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {res}
              </button>
            ))}
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 px-3 py-1.5 rounded-lg text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Image Stage with Drag Pan & Anti-Theft Shield */}
      <div 
        className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          style={{
            transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${zoomLevel})`,
            transition: isPanning ? 'none' : 'transform 0.15s ease-out',
          }}
          className="relative max-w-full max-h-full transition-transform"
        >
          {/* Actual 8K Image Asset */}
          <img
            src={image.url}
            alt={image.caption[lang] || projectName}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className="w-full h-full object-contain pointer-events-none filter contrast-105"
            style={{
              maxHeight: isFullscreen ? '90vh' : '580px',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          />

          {/* Dynamic Anti-Theft Copyright Hologram Shield */}
          {showWatermark && (
            <div 
              className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 select-none opacity-40 mix-blend-overlay"
              style={{ userSelect: 'none' }}
            >
              <div className="flex justify-between text-[11px] font-mono tracking-widest text-white/70 uppercase">
                <span>© NAWARA STUDIO 8K ARCHIVE</span>
                <span>AFGHANISTAN ARCHITECTURE</span>
              </div>
              <div className="text-center text-xs sm:text-sm font-mono tracking-[0.25em] text-white/50 uppercase rotate-[-15deg] font-bold">
                NO-ARA ENGINEERING & CONSTRUCTION CO. — WATERMARKED PREVIEW ONLY
              </div>
              <div className="flex justify-between text-[10px] font-mono text-white/70">
                <span>SECURE EXIF: SONY A7R V • FE 16-35MM GM II</span>
                <span>COLOR PROFILE: DCI-P3 8K MASTER</span>
              </div>
            </div>
          )}

          {/* Invisible Layer Blocking Extraction */}
          <div 
            className="absolute inset-0 z-10" 
            onContextMenu={handleContextMenu}
            onDragStart={(e) => e.preventDefault()}
          />
        </div>

        {/* Security Popup Banner when right click is attempted */}
        {showSecurityAlert && (
          <div className="absolute top-20 bg-amber-500 text-neutral-950 px-4 py-2.5 rounded-xl shadow-2xl z-30 font-bold text-xs flex items-center gap-2 animate-bounce">
            <Lock className="w-4 h-4" />
            <span>
              {isFa
                ? 'کپی‌رایت نوآرا استدیو: ذخیره‌سازی مستقیم تصاویر مسدود است. رزولوشن 8K جهت پیش‌نمایش در دسترس است.'
                : isPs
                ? 'د نوآرا سټوډیو کاپي رایټ: د عکسونو مستقیم کښته کول بند دي. 8K کیفیت یوازې د کتو لپاره دی.'
                : 'Copyright Protected: Direct saving is blocked. 8K high-fidelity is enabled for viewing.'}
            </span>
          </div>
        )}
      </div>

      {/* Caption & Technical Details Bar */}
      <div className="absolute bottom-16 left-4 right-4 bg-neutral-950/85 backdrop-blur-md border border-neutral-800 rounded-xl p-3 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="text-xs text-neutral-200">
          <span className="font-semibold text-amber-400">
            {isFa ? 'شرح نما:' : isPs ? 'تشریح:' : 'View:'}
          </span>{' '}
          {image.caption[lang] || image.caption.en}
        </div>
        <div className="text-[11px] text-neutral-400 font-mono flex items-center gap-3">
          <span>{Math.round(zoomLevel * 100)}% {isFa ? 'بزرگ‌نمایی' : isPs ? 'لویوالی' : 'Zoom'}</span>
          <span>•</span>
          <span className="text-emerald-400">{isFa ? 'تراکم پیکسلی ۷۶۸۰x۴۳۲۰' : '7680x4320 Dynamic Master'}</span>
        </div>
      </div>

      {/* Bottom Floating Toolbar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-full px-4 py-1.5 flex items-center gap-3 shadow-2xl z-20">
        <button
          id="btn-zoom-out"
          type="button"
          onClick={() => setZoomLevel((prev) => Math.max(1, prev - 0.5))}
          className="p-1 text-neutral-400 hover:text-neutral-100 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="text-xs font-mono text-neutral-300 w-12 text-center">
          {Math.round(zoomLevel * 100)}%
        </span>

        <button
          id="btn-zoom-in"
          type="button"
          onClick={() => setZoomLevel((prev) => Math.min(5, prev + 0.5))}
          className="p-1 text-neutral-400 hover:text-neutral-100 transition-colors"
          title="Zoom In (Up to 500%)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-neutral-800" />

        <button
          id="btn-zoom-reset"
          type="button"
          onClick={handleReset}
          className="p-1 text-neutral-400 hover:text-amber-300 transition-colors text-xs flex items-center gap-1"
          title="Reset View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-[11px] hidden sm:inline">{isFa ? 'تنظیم مجدد' : isPs ? 'اصلي حالت' : 'Reset'}</span>
        </button>

        <div className="w-px h-4 bg-neutral-800" />

        <button
          id="btn-toggle-fullscreen"
          type="button"
          onClick={toggleFullscreen}
          className="p-1 text-neutral-400 hover:text-neutral-100 transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
