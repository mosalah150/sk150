"use client";

import React, { useState } from "react";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { downloadFiles } from "@/utils/downloadData";
import { DownloadFile } from "@/types/download";

type CategoryFilter = "All" | "PDF" | "Wallpaper" | "Logo" | "Documents";

export default function DownloadsPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");

  // Track downloading states to trigger simulated progress spinners (micro-animations)
  const [downloadingStates, setDownloadingStates] = useState<Record<string, boolean>>({});

  const handleDownloadClick = (file: DownloadFile) => {
    if (downloadingStates[file.id]) return;

    setDownloadingStates((prev) => ({ ...prev, [file.id]: true }));

    // Simulate edge fetch response lag (1000ms)
    setTimeout(() => {
      setDownloadingStates((prev) => ({ ...prev, [file.id]: false }));
      alert(`Simulating browser download: ${file.title}.${file.fileExtension.toLowerCase()}`);
    }, 1000);
  };

  const filteredFiles = downloadFiles.filter(
    (file) => activeCategory === "All" || file.category === activeCategory,
  );

  const categories: CategoryFilter[] = ["All", "PDF", "Wallpaper", "Logo", "Documents"];

  // Helper method to resolve format branding color styles
  const getFormatBadgeStyles = (extension: string) => {
    switch (extension) {
      case "PDF":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "PNG":
      case "JPG":
        return "bg-sky-500/10 text-sky-500 border-sky-500/20";
      case "SVG":
      case "ZIP":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    }
  };

  return (
    <div className="bg-canvas text-text flex-1 pb-24 transition-colors duration-200 select-none">
      {/* 1. Page Header */}
      <section className="bg-canvas-muted border-border border-b py-16 sm:py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <span className="text-brand text-xs font-bold tracking-widest uppercase">Assets</span>
            <h1 className="text-text mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Downloads Center
            </h1>
            <p className="text-text-muted mt-4 text-lg leading-relaxed">
              Retrieve vector brand logos, high-resolution desktop wallpapers, design token schemas,
              and platform architecture whitepapers.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`focus-visible:outline-brand cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 ${
                  activeCategory === category
                    ? "bg-text text-canvas"
                    : "bg-canvas text-text-muted border-border hover:bg-canvas-muted hover:text-text hover:border-text-muted border"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* 2. Responsive Cards Grid */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeader
            title={`${activeCategory} Resources`}
            subtitle="Securely compiled assets verified against local platform testing environments."
          />

          {filteredFiles.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFiles.map((file) => {
                const isDownloading = downloadingStates[file.id];

                return (
                  <div
                    key={file.id}
                    className="border-border bg-canvas group hover:border-text-muted flex flex-col justify-between overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div>
                      {/* Card Header row with Extension badge & size */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`rounded-lg border px-2.5 py-1 text-xs font-black tracking-wider uppercase ${getFormatBadgeStyles(
                            file.fileExtension,
                          )}`}
                        >
                          {file.fileExtension}
                        </span>
                        <span className="text-text-muted text-xs font-semibold">
                          {file.fileSize}
                        </span>
                      </div>

                      {/* File Details */}
                      <h3 className="text-text group-hover:text-brand mt-5 text-lg font-bold tracking-tight transition-colors">
                        {file.title}
                      </h3>
                      <p className="text-text-muted mt-3 text-xs leading-relaxed sm:text-sm">
                        {file.description}
                      </p>
                    </div>

                    {/* Bottom Action Section */}
                    <div className="border-border mt-8 flex items-center justify-between border-t pt-6">
                      <span className="text-text-muted text-[10px] font-bold tracking-widest uppercase">
                        {file.category}
                      </span>

                      {/* Simulated Ticking Download Button */}
                      <button
                        onClick={() => handleDownloadClick(file)}
                        disabled={isDownloading}
                        className={`focus-visible:outline-brand flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all select-none focus-visible:outline focus-visible:outline-2 ${
                          isDownloading
                            ? "bg-canvas-muted text-text-muted border-border cursor-not-allowed"
                            : "bg-text text-canvas hover:bg-canvas hover:text-text hover:border-text border-transparent"
                        }`}
                      >
                        {isDownloading ? (
                          <>
                            <div className="border-text-muted h-3 w-3 animate-spin rounded-full border-2 border-t-transparent" />
                            Fetching...
                          </>
                        ) : (
                          <>
                            <svg
                              className="h-3.5 w-3.5"
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
                            Download
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border-border bg-canvas-muted rounded-3xl border py-16 text-center">
              <p className="text-text-muted text-lg">No files found in this category.</p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
