"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { galleryImages, GalleryImage } from "@/utils/galleryData";

type AlbumFilter = "All" | "Visual Art" | "Athletics" | "Workspaces";

export default function GalleryPage() {
  const [activeAlbum, setActiveAlbum] = useState<AlbumFilter>("All");
  const [images, setImages] = useState<GalleryImage[]>(galleryImages);
  const [loading, setLoading] = useState(false);
  const [loadCount, setLoadCount] = useState(0);

  // Lightbox State
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const lightboxDialogRef = useRef<HTMLDialogElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Filtered Images based on Selected Album
  const filteredImages = images.filter((img) => activeAlbum === "All" || img.album === activeAlbum);

  // Infinite Scroll Trigger
  const loadMoreImages = useCallback(() => {
    if (loading || loadCount >= 3) return; // Limit loads to 3 cycles for demonstration stability

    setLoading(true);
    setTimeout(() => {
      // Create duplicate copy of items with unique IDs
      const nextBatch = galleryImages.map((img) => ({
        ...img,
        id: `${img.id}-load-${loadCount}`,
      }));

      setImages((prev) => [...prev, ...nextBatch]);
      setLoadCount((prev) => prev + 1);
      setLoading(false);
    }, 1000);
  }, [loading, loadCount]);

  // Setup Intersection Observer on Sentinel element
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreImages();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMoreImages]);

  // Lightbox Navigation Triggers
  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
    lightboxDialogRef.current?.showModal();
  };

  const closeLightbox = () => {
    lightboxDialogRef.current?.close();
    setActivePhotoIndex(null);
  };

  const navigateNext = useCallback(() => {
    if (activePhotoIndex === null) return;
    const nextIndex = (activePhotoIndex + 1) % filteredImages.length;
    setActivePhotoIndex(nextIndex);
  }, [activePhotoIndex, filteredImages.length]);

  const navigatePrev = useCallback(() => {
    if (activePhotoIndex === null) return;
    const prevIndex = (activePhotoIndex - 1 + filteredImages.length) % filteredImages.length;
    setActivePhotoIndex(prevIndex);
  }, [activePhotoIndex, filteredImages.length]);

  // Keyboard navigation inside Lightbox modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (activePhotoIndex === null) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        navigateNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigatePrev();
      } else if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIndex, navigateNext, navigatePrev]);

  // Reset page catalog state when album filter changes
  useEffect(() => {
    setImages(galleryImages);
    setLoadCount(0);
  }, [activeAlbum]);

  const activePhoto = activePhotoIndex !== null ? filteredImages[activePhotoIndex] : null;
  const albums: AlbumFilter[] = ["All", "Visual Art", "Athletics", "Workspaces"];

  return (
    <div className="bg-canvas text-text flex-1 transition-colors duration-200">
      {/* 1. Page Header */}
      <section className="bg-canvas-muted border-border border-b py-16 sm:py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <span className="text-brand text-xs font-bold tracking-widest uppercase">Showcase</span>
            <h1 className="text-text mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Visual Gallery
            </h1>
            <p className="text-text-muted mt-4 text-lg leading-relaxed">
              Explore dynamic design prototypes, computational geometry, track sports, and student
              collaboration spaces built inside the SK150 network.
            </p>
          </div>

          {/* Album Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pb-4">
            {albums.map((album) => (
              <button
                key={album}
                onClick={() => setActiveAlbum(album)}
                className={`focus-visible:outline-brand cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 ${
                  activeAlbum === album
                    ? "bg-text text-canvas"
                    : "bg-canvas text-text-muted hover:bg-canvas-muted hover:text-text border-border hover:border-text-muted border"
                }`}
              >
                {album}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* 2. Masonry Grid Showcase */}
      <section className="py-16 sm:py-24">
        <Container clean>
          <SectionHeader
            title={`${activeAlbum} Album`}
            subtitle="Click on any visual model to inspect metadata details and trigger full-screen lightbox previews."
            className="px-4 sm:px-6 lg:px-8"
          />

          {filteredImages.length > 0 ? (
            <div className="columns-1 gap-6 space-y-6 px-4 sm:columns-2 sm:px-6 md:columns-3 lg:columns-4 lg:px-8">
              {filteredImages.map((img, index) => {
                const aspectStyles = {
                  video: "aspect-video",
                  square: "aspect-square",
                  portrait: "aspect-[3/4]",
                  wide: "aspect-[21/9]",
                };

                return (
                  <div
                    key={img.id}
                    className="border-border bg-canvas group hover:border-text-muted relative cursor-pointer break-inside-avoid overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    onClick={() => openLightbox(index)}
                  >
                    <div
                      className={`relative w-full overflow-hidden ${aspectStyles[img.aspectRatio]}`}
                    >
                      <Image
                        src={img.imageSrc}
                        alt={img.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-103"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        loading="lazy"
                      />
                      {/* Interactive visual text card that slides up on hover */}
                      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 text-left text-white opacity-0 transition-opacity duration-300 select-none group-hover:opacity-100">
                        <span className="text-brand text-[10px] font-bold tracking-widest uppercase">
                          {img.album}
                        </span>
                        <h3 className="mt-1 line-clamp-1 text-base font-bold tracking-tight">
                          {img.title}
                        </h3>
                        {img.location && (
                          <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-neutral-300">
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
                            {img.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border-border bg-canvas-muted mx-8 rounded-3xl border py-16 text-center">
              <p className="text-text-muted text-lg">No images found in this album.</p>
            </div>
          )}

          {/* Infinite Scroll Sentinel element */}
          <div ref={sentinelRef} className="flex items-center justify-center py-16 text-center">
            {loading && (
              <div className="flex flex-col items-center gap-3">
                <div className="border-brand h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                <span className="text-text-muted text-xs font-semibold tracking-wider uppercase">
                  Loading assets...
                </span>
              </div>
            )}
            {!loading && loadCount >= 3 && (
              <span className="text-text-muted text-xs font-bold tracking-widest uppercase">
                All visual items loaded
              </span>
            )}
          </div>
        </Container>
      </section>

      {/* 3. Accessible Apple Photos Lightbox Modal Dialog */}
      <dialog
        ref={lightboxDialogRef}
        className="border-border bg-canvas/98 h-[85vh] w-[92%] max-w-5xl overflow-hidden rounded-3xl border p-0 shadow-2xl backdrop-blur-lg outline-none select-none backdrop:bg-black/90 backdrop:backdrop-blur-md"
        onClose={closeLightbox}
      >
        <div className="relative flex h-full w-full flex-col justify-between bg-black/40">
          {/* Lightbox Top bar */}
          <div className="absolute top-0 right-0 left-0 z-30 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent px-6 py-4 text-white">
            <div className="text-left">
              <span className="text-brand text-[10px] font-bold tracking-widest uppercase">
                {activePhoto?.album}
              </span>
              <h4 className="line-clamp-1 text-sm font-bold sm:text-base">{activePhoto?.title}</h4>
            </div>
            <button
              onClick={closeLightbox}
              className="focus-visible:outline-brand cursor-pointer rounded-full border border-white/10 bg-black/40 p-2 text-neutral-300 hover:bg-black/60 hover:text-white focus-visible:outline focus-visible:outline-2"
              aria-label="Close Lightbox"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Lightbox Core Image Content Area */}
          <div className="relative mt-16 flex max-h-[75vh] flex-1 items-center justify-center p-4">
            {/* Prev Arrow Button */}
            <button
              onClick={navigatePrev}
              className="focus-visible:outline-brand absolute left-4 z-30 cursor-pointer rounded-full border border-white/10 bg-black/40 p-3 text-white transition-all hover:scale-105 hover:bg-black/60 focus-visible:outline focus-visible:outline-2 active:scale-95"
              aria-label="Previous image"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Main Visual Frame */}
            {activePhoto && (
              <div className="relative flex h-full max-h-[60vh] w-full max-w-4xl items-center justify-center">
                <Image
                  src={activePhoto.imageSrc}
                  alt={activePhoto.title}
                  fill
                  className="animate-in zoom-in-95 object-contain duration-200"
                  sizes="80vw"
                  priority
                />
              </div>
            )}

            {/* Next Arrow Button */}
            <button
              onClick={navigateNext}
              className="focus-visible:outline-brand absolute right-4 z-30 cursor-pointer rounded-full border border-white/10 bg-black/40 p-3 text-white transition-all hover:scale-105 hover:bg-black/60 focus-visible:outline focus-visible:outline-2 active:scale-95"
              aria-label="Next image"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Lightbox Bottom bar */}
          <div className="absolute right-0 bottom-0 left-0 z-30 flex flex-col items-center justify-between gap-4 bg-gradient-to-t from-black/50 to-transparent p-6 text-xs text-white sm:flex-row">
            <p className="max-w-lg text-center text-xs text-neutral-300 sm:text-left sm:text-sm">
              {activePhoto?.description}
            </p>
            <div className="flex items-center gap-4 font-medium text-neutral-400">
              {activePhoto?.location && (
                <span className="flex items-center gap-1">
                  <svg
                    className="h-3.5 w-3.5"
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
                  {activePhoto?.location}
                </span>
              )}
              {activePhoto?.date && <span>{activePhoto?.date}</span>}
              <span className="rounded border border-white/5 bg-white/10 px-2 py-0.5 font-semibold text-white/60">
                {activePhotoIndex !== null && `${activePhotoIndex + 1} / ${filteredImages.length}`}
              </span>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
