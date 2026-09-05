"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import parse, { DOMNode, Element, domToReact } from "html-react-parser";
import { STITCH_PANELS, STITCH_PROJECT } from "@/lib/stitchPanelsData";
import PlatesGallery from "./PlatesGallery";

export default function StitchFolio() {
  const [activePanel, setActivePanel] = useState<string>("01-hero");
  const [viewMode, setViewMode] = useState<"interactive" | "plates">("interactive");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Smooth scroll handler
  const scrollTo = (panelId: string) => {
    setViewMode("interactive");
    setMobileMenuOpen(false);
    const elem = document.getElementById(panelId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
      setActivePanel(panelId);
    }
  };

  // Track active section via IntersectionObserver
  useEffect(() => {
    if (viewMode !== "interactive") return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActivePanel(entry.target.id);
          }
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0.1,
      }
    );

    STITCH_PANELS.forEach((p) => {
      const el = document.getElementById(p.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [viewMode]);

  // Current active panel index (1-based)
  const currentIdx = STITCH_PANELS.findIndex((p) => p.id === activePanel);
  const currentNum = currentIdx >= 0 ? currentIdx + 1 : 1;
  const nextPanel = STITCH_PANELS[(currentIdx + 1) % STITCH_PANELS.length];

  // Parser transform options
  const parserOptions = {
    replace: (domNode: DOMNode) => {
      if (domNode instanceof Element && domNode.tagName === "a") {
        const href = domNode.attribs?.href;
        if (href === "#channels" || href === "#access" || href === "/login") {
          return (
            <Link
              href="/login"
              className={domNode.attribs?.class || ""}
            >
              {domToReact(domNode.children as DOMNode[])}
            </Link>
          );
        }
        if (href && href.startsWith("#")) {
          const targetId = href.replace("#", "");
          return (
            <a
              href={href}
              className={domNode.attribs?.class || ""}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(targetId);
              }}
            >
              {domToReact(domNode.children as DOMNode[])}
            </a>
          );
        }
      }
      return undefined;
    },
  };

  return (
    <div className="w-full min-h-screen bg-surface text-on-surface flex flex-col selection:bg-primary selection:text-on-primary font-serif">
      {/* Sticky Institutional Folio Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-surface-container-lowest/95 backdrop-blur-md shadow-2xl border-b border-surface-container-highest/60"
            : "bg-surface-container-lowest/80 backdrop-blur-sm border-b border-surface-container-highest/30"
        }`}
      >
        <div className="h-20 max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between gap-4">
          {/* Brand Wordmark & Pantheon Emblem */}
          <div
            onClick={() => scrollTo("01-hero")}
            className="flex items-center gap-3 shrink-0 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-surface-container border border-primary/40 flex items-center justify-center text-primary group-hover:border-primary group-hover:scale-105 transition-all shadow-md">
              <span className="material-symbols-outlined text-[20px]">account_balance</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg md:text-xl text-primary tracking-wide font-medium">
                  SAATHI VYAPAR
                </span>
                <span className="text-xs text-primary/70 font-sans hidden sm:inline">
                  साथी व्यापार
                </span>
              </div>
              <span className="text-[10px] font-mono text-outline tracking-widest uppercase">
                Archival Commerce · SIH26091
              </span>
            </div>
          </div>

          {/* Center Navigation: 9 Folio Panels */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1 text-[11px] font-mono tracking-wider uppercase">
            {STITCH_PANELS.map((p) => {
              const isActive = viewMode === "interactive" && activePanel === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => scrollTo(p.id)}
                  className={`px-2.5 py-1.5 rounded transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-on-primary font-semibold shadow-md"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  }`}
                >
                  {p.title}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: View Switcher & Gateway Button */}
          <div className="flex items-center gap-3 shrink-0">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-surface-container p-0.5 rounded-lg border border-surface-container-highest">
              <button
                type="button"
                onClick={() => setViewMode("interactive")}
                className={`px-2.5 py-1 rounded text-xs font-mono tracking-wider transition-colors flex items-center gap-1 ${
                  viewMode === "interactive"
                    ? "bg-primary/20 text-primary font-medium"
                    : "text-outline hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">view_agenda</span>
                Canvas
              </button>
              <button
                type="button"
                onClick={() => setViewMode("plates")}
                className={`px-2.5 py-1 rounded text-xs font-mono tracking-wider transition-colors flex items-center gap-1 ${
                  viewMode === "plates"
                    ? "bg-primary/20 text-primary font-medium"
                    : "text-outline hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">collections</span>
                Plates (9)
              </button>
            </div>

            {/* Launch App / Login Gateway */}
            <Link
              href="/login"
              className="px-4 py-2 bg-primary hover:bg-primary-fixed text-on-primary text-xs font-mono font-semibold tracking-wider uppercase rounded shadow hover:shadow-primary/20 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span className="hidden md:inline">Access Gateway</span>
              <span className="md:hidden">Sign In</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[20px]">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-surface-container-lowest/98 border-b border-surface-container-highest px-4 py-4 space-y-2">
            <div className="flex sm:hidden items-center gap-2 mb-3 pb-2 border-b border-surface-container-highest">
              <button
                type="button"
                onClick={() => {
                  setViewMode("interactive");
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 py-1.5 text-center text-xs font-mono rounded ${
                  viewMode === "interactive" ? "bg-primary text-on-primary" : "bg-surface-container"
                }`}
              >
                Live Canvas
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode("plates");
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 py-1.5 text-center text-xs font-mono rounded ${
                  viewMode === "plates" ? "bg-primary text-on-primary" : "bg-surface-container"
                }`}
              >
                Stitch Plates (9)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
              {STITCH_PANELS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => scrollTo(p.id)}
                  className={`p-2 rounded text-left truncate transition-colors ${
                    activePanel === p.id
                      ? "bg-primary text-on-primary font-semibold"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="w-full pt-20">
        {viewMode === "plates" ? (
          <PlatesGallery onSelectPanel={scrollTo} />
        ) : (
          <div className="flex flex-col w-full">
            {STITCH_PANELS.map((panel) => (
              <section
                key={panel.id}
                id={panel.id}
                className="w-full relative scroll-mt-20 border-b border-surface-container-highest/30 overflow-hidden"
              >
                {/* Panel Anchor Identifier Bar */}
                <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pt-6 pb-2 flex items-center justify-between text-[11px] font-mono text-outline">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary/60" />
                    <span className="text-primary font-semibold uppercase">
                      FOLIO SPECIMEN {panel.num < 10 ? `0${panel.num}` : panel.num} / 09
                    </span>
                    <span className="hidden sm:inline text-outline-variant">•</span>
                    <span className="hidden sm:inline text-on-surface-variant">
                      {panel.fullTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={panel.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <span>Screenshot</span>
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </a>
                  </div>
                </div>

                {/* Rendered HTML Panel with Tailwind & Neoclassical Styling */}
                <div className="w-full">
                  {parse(panel.html, parserOptions)}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Floating Navigator Bar (Bottom Right) */}
      <aside aria-label="Folio Quick Navigation" className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-surface-container-lowest/90 backdrop-blur-md border border-surface-container-highest/80 rounded-full px-4 py-2 shadow-2xl">
        <div className="flex items-center gap-2 pr-2 border-r border-surface-container-highest text-xs font-mono">
          <span className="text-primary font-bold">
            {currentNum < 10 ? `0${currentNum}` : currentNum}
          </span>
          <span className="text-outline">/ 09</span>
        </div>

        {/* Jump Next */}
        <button
          type="button"
          onClick={() => scrollTo(nextPanel.id)}
          title={`Jump to next: ${nextPanel.title}`}
          className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
        </button>

        {/* Scroll Top */}
        <button
          type="button"
          onClick={() => scrollTo("01-hero")}
          title="Back to Top"
          className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[18px]">vertical_align_top</span>
        </button>
      </aside>

      {/* Institutional Archival Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-surface-container-highest/50 py-12 px-4 md:px-8 lg:px-12 text-center text-on-surface-variant">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary border border-primary/30">
            <span className="material-symbols-outlined text-[24px]">account_balance</span>
          </div>
          <h4 className="text-2xl font-serif text-on-surface font-normal">
            Saathi Vyapar · साथी व्यापार
          </h4>
          <p className="text-sm font-serif max-w-xl text-on-surface-variant">
            Ministry of Social Justice & Empowerment · Smart India Hackathon (SIH26091).
            Engineered by Team Pantheon Eternal.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-outline pt-2">
            <Link href="/login" className="hover:text-primary transition-colors">
              Access Web Terminal
            </Link>
            <span>•</span>
            <button
              type="button"
              onClick={() => setViewMode(viewMode === "interactive" ? "plates" : "interactive")}
              className="hover:text-primary transition-colors"
            >
              Toggle Stitch Plates
            </button>
            <span>•</span>
            <a
              href="https://wa.me/?text=Hi%20Saathi%20Vyapar"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              WhatsApp Conduit
            </a>
          </div>
          <p className="text-[11px] font-mono text-outline/60 pt-4">
            Stitch MCP Repository: projects/{STITCH_PROJECT.id} · 9 Certified Archival Plates
          </p>
        </div>
      </footer>
    </div>
  );
}
