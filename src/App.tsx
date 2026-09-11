import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowDown, ChevronUp, Info, X } from 'lucide-react';
import { useVideoScrub } from '@/useVideoScrub';

const VIDEO_URL = '/download.mp4';

const DARK = '#1D3045';

interface StaggerProps {
  show: boolean;
  delayMs?: number;
  className?: string;
  children: React.ReactNode;
}

function Stagger({ show, delayMs = 0, className = '', children }: StaggerProps) {
  return (
    <div
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const { containerRef, videoRef, canvasRef, scrollProgress: p, isCanvasLive } = useVideoScrub(VIDEO_URL);

  const [navMounted, setNavMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Entrance animation for Navbar
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavMounted(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  // Color flips at p > 0.55: DARK -> white (duration-500)
  const isLightNav = p > 0.55;

  // Sequential Opacities
  // s1Opacity: p < 0.20 -> 1; else -> max(0, 1 - (p - 0.20) / 0.08)
  const s1Opacity = p < 0.20 ? 1 : Math.max(0, 1 - (p - 0.20) / 0.08);

  // s2Opacity: p < 0.32 -> 0; p < 0.40 -> (p - 0.32) / 0.08; p < 0.55 -> 1; else -> max(0, 1 - (p - 0.55) / 0.08)
  const s2Opacity =
    p < 0.32
      ? 0
      : p < 0.40
      ? (p - 0.32) / 0.08
      : p < 0.55
      ? 1
      : Math.max(0, 1 - (p - 0.55) / 0.08);

  // s3Opacity: p < 0.67 -> 0; p < 0.75 -> (p - 0.67) / 0.08; else -> 1
  const s3Opacity = p < 0.67 ? 0 : p < 0.75 ? (p - 0.67) / 0.08 : 1;

  // Stagger triggers when section opacity > 0.3
  const s1Show = s1Opacity > 0.3;
  const s2Show = s2Opacity > 0.3;
  const s3Show = s3Opacity > 0.3;

  const navLinks = [
    { label: 'VECTRUS ENERGY', active: true },
    { label: 'VECTRUS UPSTREAM', active: false },
    { label: 'VECTRUS MARKETS', active: false },
    { label: 'VECTRUS SYSTEMS', active: false },
    { label: 'VECTRUS+', active: false },
  ];

  return (
    <div ref={containerRef} className="relative h-[500vh]">
      {/* Sticky scene */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* 1) Video full cover (playback driven purely by scroll, never autoplayed) */}
        <video
          ref={videoRef}
          src={VIDEO_URL}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
        />

        {/* 2) Canvas 1920x1080 for decoded WebCodecs frames */}
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isCanvasLive ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* 3) Overlay containing Navbar + 3 sequential sections */}
        <div className="absolute inset-0 pointer-events-none">
          {/* NAVBAR */}
          <nav className="absolute top-0 left-0 right-0 z-50 pointer-events-auto px-6 sm:px-8 md:px-12 pt-8 sm:pt-12 pb-6 flex items-center justify-between transition-colors duration-500">
            {/* Desktop Left Cluster */}
            <div className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navLinks.map((link, i) => (
                <a
                  key={link.label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className={`relative text-xs tracking-[0.15em] uppercase font-medium transition-colors duration-500 hover:opacity-70 ${
                    isLightNav ? 'text-white' : 'text-[#1D3045]'
                  }`}
                  style={{
                    opacity: navMounted ? 1 : 0,
                    transform: navMounted ? 'translateY(0)' : 'translateY(-12px)',
                    transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${
                      i * 80 + 100
                    }ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${
                      i * 80 + 100
                    }ms, color 0.5s ease`,
                  }}
                >
                  {link.label}
                  {link.active && (
                    <span
                      className={`absolute -bottom-3 left-0 right-0 h-[2px] transition-colors duration-500 ${
                        isLightNav ? 'bg-white' : 'bg-[#1D3045]'
                      }`}
                    />
                  )}
                </a>
              ))}
            </div>

            {/* Mobile <lg Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="lg:hidden flex flex-col justify-center gap-[5px] focus:outline-none"
            >
              <span
                className={`block w-6 h-[2px] transition-colors duration-500 ${
                  isLightNav ? 'bg-white' : 'bg-[#1D3045]'
                }`}
              />
              <span
                className={`block w-6 h-[2px] transition-colors duration-500 ${
                  isLightNav ? 'bg-white' : 'bg-[#1D3045]'
                }`}
              />
              <span
                className={`block w-4 h-[2px] transition-colors duration-500 ${
                  isLightNav ? 'bg-white' : 'bg-[#1D3045]'
                }`}
              />
            </button>

            {/* Right Cluster (hidden below sm) */}
            <div
              className="hidden sm:flex items-center gap-6"
              style={{
                opacity: navMounted ? 1 : 0,
                transform: navMounted ? 'translateY(0)' : 'translateY(-12px)',
                transition:
                  'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 500ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 500ms',
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-500 ${
                    isLightNav ? 'text-white' : 'text-[#1D3045]'
                  }`}
                >
                  NEWS
                </span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-500 ${
                    isLightNav ? 'bg-white text-[#1D3045]' : 'bg-[#1D3045] text-white'
                  }`}
                >
                  <Info size={10} strokeWidth={2.5} />
                </div>
              </div>

              {/* MENU label */}
              <span
                className={`hidden lg:inline text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-500 ${
                  isLightNav ? 'text-white' : 'text-[#1D3045]'
                }`}
              >
                MENU
              </span>
              <button
                onClick={() => setMenuOpen(true)}
                className={`lg:hidden text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-500 ${
                  isLightNav ? 'text-white' : 'text-[#1D3045]'
                }`}
              >
                MENU
              </button>
            </div>
          </nav>

          {/* SECTION 1: Hero (left-aligned, vertically centered) */}
          <div
            className="absolute inset-0 px-6 sm:px-8 md:px-20 lg:px-32 flex flex-col justify-center"
            style={{
              opacity: s1Opacity,
              transition: 'opacity 0.1s ease-out',
              pointerEvents: s1Opacity > 0.05 ? 'auto' : 'none',
            }}
          >
            <div className="max-w-4xl">
              <Stagger show={s1Show} delayMs={0}>
                <h1
                  className="text-[clamp(2rem,5vw,5rem)] font-light uppercase leading-[1.2]"
                  style={{ color: DARK }}
                >
                  Advancing resources for a cleaner future
                </h1>
              </Stagger>

              <Stagger show={s1Show} delayMs={150}>
                <p
                  className="mt-6 text-sm tracking-[0.3em] uppercase"
                  style={{ color: '#1D304590' }}
                >
                  Sustainable power with purpose
                </p>
              </Stagger>
            </div>

            {/* Bottom-right button */}
            <div className="absolute bottom-12 right-6 sm:right-8 md:right-12">
              <Stagger show={s1Show} delayMs={300}>
                <button
                  aria-label="Advance"
                  onClick={() => {
                    window.scrollBy({ top: window.innerHeight * 1.5, behavior: 'smooth' });
                  }}
                  className="w-12 h-12 rounded-full border flex items-center justify-center hover:opacity-70 transition-opacity"
                  style={{ borderColor: `${DARK}80`, color: DARK }}
                >
                  <ArrowRight size={18} />
                </button>
              </Stagger>
            </div>
          </div>

          {/* SECTION 2: Center */}
          <div
            className="absolute inset-0 px-6 sm:px-8 flex items-center justify-center"
            style={{
              opacity: s2Opacity,
              transition: 'opacity 0.1s ease-out',
              pointerEvents: s2Opacity > 0.05 ? 'auto' : 'none',
            }}
          >
            <div className="max-w-[900px] mx-auto text-center">
              <Stagger show={s2Show} delayMs={0}>
                <h2
                  className="text-[clamp(1.5rem,4.5vw,4.5rem)] font-extralight tracking-wide leading-[1.3] text-center uppercase"
                  style={{ color: DARK }}
                >
                  We build lasting partnerships with vision{' '}
                  <span style={{ color: `${DARK}CC` }}>and precision</span>{' '}
                  <span style={{ color: `${DARK}80` }}>across every frontier</span>
                </h2>
              </Stagger>
            </div>

            {/* Right column */}
            <div className="absolute bottom-16 right-6 sm:right-8 md:right-12 flex flex-col items-center gap-4">
              <Stagger show={s2Show} delayMs={200}>
                <div
                  className="w-12 h-12 rounded-full border flex items-center justify-center"
                  style={{ borderColor: `${DARK}66`, color: DARK }}
                >
                  <ArrowDown size={18} />
                </div>
              </Stagger>

              <Stagger show={s2Show} delayMs={350}>
                <div className="flex flex-col items-center gap-2 mt-4">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: DARK }} />
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `${DARK}66` }} />
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `${DARK}66` }} />
                </div>
              </Stagger>

              <Stagger show={s2Show} delayMs={500}>
                <button
                  aria-label="Scroll to top"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-10 h-10 rounded-full border flex items-center justify-center mt-2 hover:opacity-70 transition-opacity"
                  style={{ borderColor: `${DARK}4D`, color: `${DARK}CC` }}
                >
                  <ChevronUp size={16} />
                </button>
              </Stagger>
            </div>
          </div>

          {/* SECTION 3: Right aligned, white type (video is dark here) */}
          <div
            className="absolute inset-0 px-6 sm:px-8 md:px-20 lg:px-32 flex items-center justify-end"
            style={{
              opacity: s3Opacity,
              transition: 'opacity 0.1s ease-out',
              pointerEvents: s3Opacity > 0.05 ? 'auto' : 'none',
            }}
          >
            <div className="max-w-2xl text-left">
              <Stagger show={s3Show} delayMs={0}>
                <div className="text-white/60 text-lg tracking-wide mb-4">
                  Halder | Nordvik
                </div>
              </Stagger>

              <Stagger show={s3Show} delayMs={150}>
                <h2 className="text-[clamp(2rem,4vw,4rem)] font-light text-white leading-[1.2] uppercase tracking-wide mb-8">
                  Fueling ambition,<br />shaping tomorrow.
                </h2>
              </Stagger>

              <Stagger show={s3Show} delayMs={300}>
                <div className="flex items-center gap-4">
                  <span className="text-sm tracking-[0.3em] text-white/80 uppercase">
                    Contact Nordvik
                  </span>
                  <button
                    aria-label="Contact Nordvik"
                    onClick={(e) => e.preventDefault()}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-800 hover:scale-110 duration-300 transition-transform"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </Stagger>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          menuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`}
        style={{ backgroundColor: DARK }}
      >
        <div
          className={`h-full flex flex-col justify-between transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            menuOpen ? 'translate-y-0' : '-translate-y-8'
          }`}
        >
          {/* Top close button */}
          <div className="flex justify-end px-6 sm:px-8 pt-8 sm:pt-12">
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Links centered vertically */}
          <div className="flex flex-col px-8 sm:px-12 py-3">
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                }}
                className={`py-3 text-2xl sm:text-3xl font-light tracking-wide uppercase transition-all duration-500 ${
                  link.active ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
                style={{
                  transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                  opacity: menuOpen ? 1 : 0,
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-8 px-8 sm:px-12 pb-10">
            <span className="text-xs tracking-[0.2em] uppercase text-white/60">NEWS</span>
            <span className="text-xs tracking-[0.2em] uppercase text-white/60">CONTACT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
