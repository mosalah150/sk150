"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import ThemeToggle from "@/components/common/ThemeToggle";
import MegaMenu from "@/components/common/MegaMenu";
import useKeyboardShortcut from "@/hooks/useKeyboardShortcut";
import { articles } from "@/utils/blogData";
import { galleryImages } from "@/utils/galleryData";
import { events } from "@/utils/eventData";
import { studentProfiles } from "@/utils/spotlightData";
import { useDynamicData } from "@/providers/DynamicDataProvider";

export default function Navbar() {
  const { menus } = useDynamicData();
  const [activeMenu, setActiveMenu] = useState<"platform" | "resources" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navRef = useRef<HTMLDivElement>(null);
  const searchDialogRef = useRef<HTMLDialogElement>(null);

  // Mock downloads catalog
  const downloads = [
    {
      id: "d1",
      title: "SK150 Core Architecture Whitepaper (PDF)",
      category: "System Specs",
      fileSize: "2.4 MB",
    },
    {
      id: "d2",
      title: "Tailwind CSS v4 Variables Reference Sheet",
      category: "Design Tokens",
      fileSize: "1.2 MB",
    },
    {
      id: "d3",
      title: "Edge Worker Emulation local script (sh)",
      category: "DevOps Tools",
      fileSize: "14 KB",
    },
    {
      id: "d4",
      title: "Apple-Photos Layout configurations (JSON)",
      category: "Layout Assets",
      fileSize: "84 KB",
    },
  ];

  const query = searchQuery.trim().toLowerCase();

  const matchedStories = query
    ? articles
        .filter(
          (a) =>
            a.title.toLowerCase().includes(query) ||
            a.description.toLowerCase().includes(query) ||
            a.category.toLowerCase().includes(query) ||
            a.tags.some((t) => t.toLowerCase().includes(query)),
        )
        .slice(0, 3)
    : [];

  const matchedGallery = query
    ? galleryImages
        .filter(
          (img) =>
            img.title.toLowerCase().includes(query) ||
            img.description.toLowerCase().includes(query) ||
            img.album.toLowerCase().includes(query) ||
            (img.location && img.location.toLowerCase().includes(query)),
        )
        .slice(0, 3)
    : [];

  const matchedEvents = query
    ? events
        .filter(
          (e) =>
            e.title.toLowerCase().includes(query) ||
            e.description.toLowerCase().includes(query) ||
            e.location.toLowerCase().includes(query) ||
            e.phase.toLowerCase().includes(query),
        )
        .slice(0, 3)
    : [];

  const matchedStudents = query
    ? studentProfiles
        .filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            s.title.toLowerCase().includes(query) ||
            s.achievement.toLowerCase().includes(query) ||
            s.highlightQuote.toLowerCase().includes(query),
        )
        .slice(0, 3)
    : [];

  const matchedDownloads = query
    ? downloads
        .filter(
          (d) => d.title.toLowerCase().includes(query) || d.category.toLowerCase().includes(query),
        )
        .slice(0, 3)
    : [];

  const hasAnyResults =
    matchedStories.length > 0 ||
    matchedGallery.length > 0 ||
    matchedEvents.length > 0 ||
    matchedStudents.length > 0 ||
    matchedDownloads.length > 0;
  const searchInputRef = useRef<HTMLInputElement>(null);

  const platformTriggerRef = useRef<HTMLButtonElement>(null);
  const resourcesTriggerRef = useRef<HTMLButtonElement>(null);

  const openSearch = () => {
    if (searchDialogRef.current) {
      searchDialogRef.current.showModal();
      // Small timeout to ensure input renders before focusing
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  };

  const closeSearch = () => {
    searchDialogRef.current?.close();
    setSearchQuery("");
  };

  // Toggle specific mega menu tab
  const handleMenuToggle = (menu: "platform" | "resources") => {
    if (activeMenu === menu) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menu);
    }
  };

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation & shortcuts (⌘K or / to open Search Dialog)
  useKeyboardShortcut("k", openSearch, { metaKey: true });
  useKeyboardShortcut("/", () => {
    if (
      document.activeElement?.tagName !== "INPUT" &&
      document.activeElement?.tagName !== "TEXTAREA"
    ) {
      openSearch();
    }
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key handler
      if (event.key === "Escape") {
        if (activeMenu) {
          const triggerRef = activeMenu === "platform" ? platformTriggerRef : resourcesTriggerRef;
          setActiveMenu(null);
          triggerRef.current?.focus();
        }
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMenu, mobileMenuOpen]);

  return (
    <div ref={navRef} className="relative z-50">
      {/* Skip to Main Content Link for screen readers */}
      <a
        href="#content"
        className="bg-brand text-canvas focus:outline-brand fixed top-4 left-4 z-[60] -translate-y-20 rounded-lg px-4 py-2 font-semibold transition-transform focus:translate-y-0 focus:shadow-md focus:outline focus:outline-2 focus:outline-offset-2"
      >
        Skip to main content
      </a>

      {/* Sticky Header */}
      <header className="border-border bg-canvas/80 sticky top-0 w-full border-b backdrop-blur-md">
        <Container clean className="flex items-center justify-between py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center group">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-shadow group-hover:shadow-md">
                <Image
                  src="/assets/logo.jpg"
                  alt="SK150 Logo"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="text-text-muted hidden items-center gap-1 text-base font-semibold md:flex">
              {/* Platform Button Trigger */}
              <div className="relative">
                <button
                  ref={platformTriggerRef}
                  onClick={() => handleMenuToggle("platform")}
                  aria-haspopup="true"
                  aria-expanded={activeMenu === "platform"}
                  className={`hover:bg-canvas-muted hover:text-text focus-visible:outline-brand flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 transition-all duration-150 focus-visible:outline focus-visible:outline-2 ${
                    activeMenu === "platform" ? "bg-canvas-muted text-text" : ""
                  }`}
                >
                  แพลตฟอร์ม
                  <svg
                    className={`h-4 w-4 transform transition-transform duration-200 ${
                      activeMenu === "platform" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Resources Button Trigger */}
              <div className="relative">
                <button
                  ref={resourcesTriggerRef}
                  onClick={() => handleMenuToggle("resources")}
                  aria-haspopup="true"
                  aria-expanded={activeMenu === "resources"}
                  className={`hover:bg-canvas-muted hover:text-text focus-visible:outline-brand flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 transition-all duration-150 focus-visible:outline focus-visible:outline-2 ${
                    activeMenu === "resources" ? "bg-canvas-muted text-text" : ""
                  }`}
                >
                  คลังข้อมูล
                  <svg
                    className={`h-4 w-4 transform transition-transform duration-200 ${
                      activeMenu === "resources" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {menus.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="hover:bg-canvas-muted hover:text-text focus-visible:outline-brand rounded-full px-4 py-2 transition-all duration-150 focus-visible:outline focus-visible:outline-2"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input Trigger (⌘K) */}
            <button
              onClick={openSearch}
              className="border-border bg-canvas-muted text-text-muted hover:bg-canvas hover:border-text-muted focus-visible:outline-brand flex h-10 cursor-pointer items-center justify-between gap-4 rounded-full border px-4 py-2 text-sm transition-all duration-150 focus-visible:outline focus-visible:outline-2"
              aria-label="Search site content"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="hidden sm:inline">ค้นหา...</span>
              </span>
              <kbd className="border-border bg-canvas text-text-muted hidden h-5 items-center gap-0.5 rounded border px-1.5 font-mono text-[10px] font-medium select-none sm:inline-flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            <ThemeToggle />

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="border-border bg-canvas-muted text-text hover:bg-canvas focus-visible:outline-brand flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 md:hidden"
              aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu-drawer"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </Container>

        {/* Mega Menu Dropdown */}
        <MegaMenu
          isOpen={activeMenu !== null}
          menuType={activeMenu}
          onClose={() => setActiveMenu(null)}
        />
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="bg-canvas animate-in fade-in fixed inset-0 top-[73px] z-30 overflow-y-auto duration-200 md:hidden"
        >
          {/* iOS Drawer top drag capsule handle */}
          <div className="pointer-events-none flex justify-center pt-3 select-none">
            <div className="bg-border h-1 w-10 rounded-full opacity-60" />
          </div>

          <nav className="text-text flex flex-col space-y-6 p-6 text-lg font-bold">
            <div>
              <span className="text-brand mb-3 block text-xs font-black tracking-widest uppercase">
                Platform
              </span>
              <div className="border-border mt-2 grid gap-4 border-l pl-4">
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-text-muted hover:text-text text-base"
                >
                  Overview
                </Link>
                <Link
                  href="#design"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-text-muted hover:text-text text-base"
                >
                  Design System
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-text-muted hover:text-text text-base"
                >
                  Developer Tools
                </Link>
              </div>
            </div>
            <div>
              <span className="text-brand mb-3 block text-xs font-black tracking-widest uppercase">
                Resources
              </span>
              <div className="border-border mt-2 grid gap-4 border-l pl-4">
                <Link
                  href="#docs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-text-muted hover:text-text text-base"
                >
                  Documentation
                </Link>
                <Link
                  href="#tutorials"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-text-muted hover:text-text text-base"
                >
                  Tutorials
                </Link>
                <Link
                  href="#community"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-text-muted hover:text-text text-base"
                >
                  Discord Community
                </Link>
                <Link
                  href="/downloads"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-text-muted hover:text-text text-base"
                >
                  Downloads Center
                </Link>
              </div>
            </div>
            <Link
              href="/stories"
              onClick={() => setMobileMenuOpen(false)}
              className="border-border border-t pt-2"
            >
              Stories
            </Link>
            <Link href="/gallery" onClick={() => setMobileMenuOpen(false)}>
              Gallery
            </Link>
            <Link href="/media" onClick={() => setMobileMenuOpen(false)}>
              Videos
            </Link>
            <Link href="/spotlight" onClick={() => setMobileMenuOpen(false)}>
              Spotlight
            </Link>
            <Link href="/timeline" onClick={() => setMobileMenuOpen(false)}>
              Timeline
            </Link>
            <Link href="/events" onClick={() => setMobileMenuOpen(false)}>
              Events
            </Link>
          </nav>
        </div>
      )}

      {/* Spotlight Native Search Dialog */}
      <dialog
        ref={searchDialogRef}
        className="border-border bg-canvas/98 w-[90%] max-w-2xl rounded-3xl border p-0 shadow-2xl backdrop-blur-lg outline-none backdrop:bg-black/50 backdrop:backdrop-blur-sm"
        onClose={closeSearch}
      >
        <div className="border-border flex items-center gap-3 border-b px-6 py-4">
          <svg
            className="text-text-muted h-5 w-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="ค้นหาข้อมูลทำเนียบรุ่น ความทรงจำ กิจกรรม หรือเอกสารดาวน์โหลด..."
            className="text-text placeholder-text-muted w-full bg-transparent py-1 text-base outline-none sm:text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={closeSearch}
            className="bg-canvas-muted text-text-muted hover:text-text border-border hover:bg-canvas focus-visible:outline-brand cursor-pointer rounded-full border p-1 focus-visible:outline focus-visible:outline-2"
            aria-label="Close search"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Dynamic Search Results */}
        <div className="max-h-[380px] space-y-6 overflow-y-auto px-6 py-5">
          {searchQuery ? (
            hasAnyResults ? (
              <div className="space-y-6">
                {/* 1. Stories */}
                {matchedStories.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-text-muted block text-[10px] font-bold tracking-widest uppercase">
                      บันทึกความทรงจำรุ่น
                    </span>
                    <div className="grid gap-2">
                      {matchedStories.map((item) => (
                        <Link
                          key={item.id}
                          href={`/stories/${item.slug}`}
                          onClick={closeSearch}
                          className="hover:bg-canvas-muted hover:border-border flex items-center justify-between rounded-2xl border border-transparent p-3.5 text-left transition-all"
                        >
                          <div>
                            <span className="text-brand block text-[10px] font-bold tracking-wider uppercase">
                              {item.category}
                            </span>
                            <h5 className="text-text mt-1 line-clamp-1 text-sm font-bold">
                              {item.title}
                            </h5>
                            <p className="text-text-muted mt-1 line-clamp-1 text-xs">
                              {item.description}
                            </p>
                          </div>
                          <svg
                            className="text-text-muted ml-4 h-4 w-4 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Gallery */}
                {matchedGallery.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-text-muted block text-[10px] font-bold tracking-widest uppercase">
                      คลังภาพประทับใจ
                    </span>
                    <div className="grid gap-2">
                      {matchedGallery.map((item) => (
                        <Link
                          key={item.id}
                          href="/gallery"
                          onClick={closeSearch}
                          className="hover:bg-canvas-muted hover:border-border flex items-center justify-between rounded-2xl border border-transparent p-3.5 text-left transition-all"
                        >
                          <div>
                            <span className="text-brand block text-[10px] font-bold tracking-wider uppercase">
                              {item.album}
                            </span>
                            <h5 className="text-text mt-1 line-clamp-1 text-sm font-bold">
                              {item.title}
                            </h5>
                            {item.location && (
                              <p className="text-text-muted mt-1 inline-flex items-center gap-1 text-xs">
                                <svg
                                  className="h-3 w-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                {item.location}
                              </p>
                            )}
                          </div>
                          <svg
                            className="text-text-muted ml-4 h-4 w-4 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Events */}
                {matchedEvents.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-text-muted block text-[10px] font-bold tracking-widest uppercase">
                      กิจกรรมศิษย์เก่า
                    </span>
                    <div className="grid gap-2">
                      {matchedEvents.map((item) => (
                        <Link
                          key={item.id}
                          href="/events"
                          onClick={closeSearch}
                          className="hover:bg-canvas-muted hover:border-border flex items-center justify-between rounded-2xl border border-transparent p-3.5 text-left transition-all"
                        >
                          <div>
                            <span className="text-brand block text-[10px] font-bold tracking-wider uppercase">
                              {item.phase}
                            </span>
                            <h5 className="text-text mt-1 line-clamp-1 text-sm font-bold">
                              {item.title}
                            </h5>
                            <p className="text-text-muted mt-1 line-clamp-1 text-xs">
                              {item.description}
                            </p>
                          </div>
                          <svg
                            className="text-text-muted ml-4 h-4 w-4 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Students */}
                {matchedStudents.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-text-muted block text-[10px] font-bold tracking-widest uppercase">
                      ทำเนียบแนะนำศิษย์เก่าเด่น
                    </span>
                    <div className="grid gap-2">
                      {matchedStudents.map((item) => (
                        <Link
                          key={item.id}
                          href="/spotlight"
                          onClick={closeSearch}
                          className="hover:bg-canvas-muted hover:border-border flex items-center justify-between rounded-2xl border border-transparent p-3.5 text-left transition-all"
                        >
                          <div>
                            <span className="text-brand block text-[10px] font-bold tracking-wider uppercase">
                              {item.achievement}
                            </span>
                            <h5 className="text-text mt-1 line-clamp-1 text-sm font-bold">
                              {item.name}
                            </h5>
                            <p className="text-text-muted mt-1 line-clamp-1 text-xs">
                              {item.title}
                            </p>
                          </div>
                          <svg
                            className="text-text-muted ml-4 h-4 w-4 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Downloads */}
                {matchedDownloads.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-text-muted block text-[10px] font-bold tracking-widest uppercase">
                      เอกสารดาวน์โหลด
                    </span>
                    <div className="grid gap-2">
                      {matchedDownloads.map((item) => (
                        <a
                          key={item.id}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`กำลังจำลองการดาวน์โหลดไฟล์: ${item.title}`);
                            closeSearch();
                          }}
                          className="hover:bg-canvas-muted hover:border-border flex cursor-pointer items-center justify-between rounded-2xl border border-transparent p-3.5 text-left transition-all"
                        >
                          <div>
                            <span className="text-brand block text-[10px] font-bold tracking-wider uppercase">
                              {item.category}
                            </span>
                            <h5 className="text-text mt-1 line-clamp-1 text-sm font-bold">
                              {item.title}
                            </h5>
                            <span className="text-text-muted mt-1 block text-xs">
                              ขนาดไฟล์: {item.fileSize}
                            </span>
                          </div>
                          <svg
                            className="text-brand ml-4 h-5 w-5 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-text-muted text-base">
                  ไม่พบผลลัพธ์สำหรับ &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-text-muted mt-2 text-xs">
                  ลองค้นหาคำอื่นๆ เช่น &ldquo;ปัจฉิม&rdquo;, &ldquo;กีฬาสี&rdquo; หรือ
                  &ldquo;ทำเนียบ&rdquo;
                </p>
              </div>
            )
          ) : (
            <div className="space-y-4 text-left">
              <span className="text-text-muted block text-xs font-semibold tracking-wider uppercase">
                ทางเข้าข้อมูลด่วน
              </span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "ความทรงจำรุ่น", href: "/stories" },
                  { label: "คลังภาพกิจกรรม", href: "/gallery" },
                  { label: "ไทม์ไลน์กิจกรรม", href: "/timeline" },
                  { label: "แนะนำศิษย์เก่า", href: "/spotlight" },
                  { label: "กิจกรรมทำเนียบรุ่น", href: "/events" },
                  { label: "วิดีโอความทรงจำ", href: "/media" },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={closeSearch}
                    className="hover:bg-canvas-muted hover:border-border text-text hover:text-brand flex items-center gap-2.5 rounded-2xl border border-transparent p-3 text-sm font-semibold transition-all"
                  >
                    <span className="text-brand select-none">&bull;</span> {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="border-border bg-canvas-muted text-text-muted flex items-center justify-between border-t px-6 py-3 text-[11px] font-medium">
          <span>ระบบจำลองการค้นหาข้อมูลแบบเรียลไทม์</span>
          <span>
            กดปุ่ม <kbd className="bg-canvas border-border rounded border px-1 font-mono">ESC</kbd>{" "}
            เพื่อปิดหน้าต่าง
          </span>
        </div>
      </dialog>
    </div>
  );
}
