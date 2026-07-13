"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import { timelineEvents } from "@/utils/timelineData";

export default function TimelinePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Update active slide index based on scroll position (Apple product slider sync)
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, clientWidth } = container;

    // Calculate which slide is currently closest to the center view
    const index = Math.round(scrollLeft / clientWidth);
    if (index >= 0 && index < timelineEvents.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  // Navigates directly to a milestone slide when tab is clicked
  const scrollToMilestone = (index: number) => {
    const slide = slideRefs.current[index];
    const container = scrollContainerRef.current;
    if (!slide || !container) return;

    container.scrollTo({
      left: slide.offsetLeft - container.offsetLeft,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  const handleNext = () => {
    const nextIdx = Math.min(activeIndex + 1, timelineEvents.length - 1);
    scrollToMilestone(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = Math.max(activeIndex - 1, 0);
    scrollToMilestone(prevIdx);
  };

  // Adjust scroll slide refs list on mount
  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, timelineEvents.length);
  }, []);

  return (
    <div className="bg-canvas text-text min-h-screen flex-1 pb-20 transition-colors duration-200 select-none">
      {/* 1. Page Header */}
      <section className="bg-canvas-muted border-border border-b py-16 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <span className="text-brand text-xs font-bold tracking-widest uppercase">
              ประวัติกิจกรรมรุ่น
            </span>
            <h1 className="text-text mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              ไทม์ไลน์บันทึกความทรงจำ
            </h1>
            <p className="text-text-muted mt-4 text-lg leading-relaxed">
              สไลด์ดูเหตุการณ์ประวัติศาสตร์ที่พวกเรา รุ่น 150 ร่วมแรงทำร่วมกัน ตั้งแต่วันปฐมนิเทศ
              ค่ายวิทย์ กีฬาสี คอนเสิร์ตดนตรี จนถึงวันสำเร็จการศึกษา
            </p>
          </div>
        </Container>
      </section>

      {/* 2. Apple-Style Progress Navigation Track */}
      <div className="bg-canvas/80 border-border sticky top-[73px] z-20 border-b py-6 backdrop-blur-md select-none">
        <Container>
          <div className="relative mx-auto flex max-w-4xl items-center justify-between px-4 sm:px-6">
            {/* Background line connecting nodes */}
            <div className="bg-border absolute top-1/2 right-8 left-8 z-0 h-[2px] -translate-y-1/2" />

            {/* Interactive progress filler line */}
            <div
              className="bg-brand absolute top-1/2 left-8 z-0 h-[2px] -translate-y-1/2 transition-all duration-300"
              style={{
                width: `${(activeIndex / (timelineEvents.length - 1)) * 92}%`,
              }}
            />

            {timelineEvents.map((event, index) => {
              const isActive = index === activeIndex;
              const isPassed = index < activeIndex;

              return (
                <button
                  key={event.id}
                  onClick={() => scrollToMilestone(index)}
                  className="group relative z-10 flex cursor-pointer flex-col items-center focus-visible:outline-none"
                >
                  {/* Node Dot Indicator */}
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? "bg-brand border-brand text-canvas ring-brand/15 scale-110 shadow-md ring-4"
                        : isPassed
                          ? "bg-brand border-brand text-canvas"
                          : "bg-canvas border-border text-text-muted hover:border-text-muted"
                    }`}
                  >
                    {isPassed ? (
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-[10px] font-black">{index + 1}</span>
                    )}
                  </div>

                  {/* Node Label Text */}
                  <span
                    className={`absolute top-9 text-xs font-bold whitespace-nowrap transition-colors duration-200 ${
                      isActive ? "text-brand" : "text-text-muted group-hover:text-text"
                    }`}
                  >
                    {event.title}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      {/* 3. Horizontal Snapping Slides */}
      <section className="py-20">
        <Container clean>
          <div className="relative">
            {/* Scrollable Container Box */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex w-full snap-x snap-mandatory scrollbar-none gap-6 overflow-x-auto scroll-smooth px-[6vw] pb-8 select-none sm:px-[8vw] lg:px-[10vw]"
            >
              {timelineEvents.map((event, index) => (
                <div
                  key={event.id}
                  ref={(el) => {
                    slideRefs.current[index] = el;
                  }}
                  className="w-[88vw] shrink-0 snap-center px-2 select-none sm:w-[84vw] lg:w-[80vw]"
                >
                  {/* Slide Container */}
                  <div className="bg-canvas border-border hover:border-text-muted grid min-h-[500px] gap-8 rounded-[32px] border p-6 shadow-md transition-all duration-300 sm:p-10 lg:grid-cols-12 lg:gap-12">
                    {/* Visual Cover Panel */}
                    <div className="border-border bg-canvas-muted relative aspect-video min-h-[260px] w-full overflow-hidden rounded-[24px] border lg:col-span-6 lg:aspect-auto">
                      <Image
                        src={event.imageSrc}
                        alt={event.title}
                        fill
                        priority={index === 0}
                        className="object-cover transition-transform duration-500 hover:scale-101"
                        sizes="(max-width: 1024px) 80vw, 40vw"
                      />
                      <span className="absolute top-4 left-4 z-10 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-sm">
                        {event.phase}
                      </span>
                    </div>

                    {/* Milestone Information Detail Panel */}
                    <div className="flex flex-col justify-between text-left lg:col-span-6">
                      <div>
                        {/* Tags list */}
                        <div className="mb-4 flex flex-wrap gap-2">
                          {event.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-brand/5 border-brand/10 text-brand rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <h2 className="text-text text-3xl leading-none font-black tracking-tight">
                          {event.title}
                        </h2>
                        <h4 className="text-text-muted mt-2 text-base font-bold">
                          {event.subtitle}
                        </h4>

                        <p className="text-text-muted mt-4 text-sm leading-relaxed sm:text-base">
                          {event.description}
                        </p>

                        {/* Bullet Highlights Checkpoints */}
                        <ul className="mt-6 space-y-3">
                          {event.bullets.map((bullet, bIdx) => (
                            <li
                              key={bIdx}
                              className="text-text-muted flex items-start gap-3 text-xs font-medium sm:text-sm"
                            >
                              <span className="bg-brand/10 text-brand flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                                <svg
                                  className="h-3 w-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-border text-text-muted mt-8 flex items-center justify-between border-t pt-4 text-xs font-semibold">
                        <span>ลำดับประวัติศิษย์เก่า</span>
                        <span>{event.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Arrow Controls */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={handlePrev}
                disabled={activeIndex === 0}
                className="bg-canvas border-border text-text hover:border-text disabled:hover:border-border focus-visible:outline-brand cursor-pointer rounded-full border p-3 transition-all focus-visible:outline focus-visible:outline-2 disabled:opacity-40"
                aria-label="Previous Slide"
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

              <span className="text-text-muted text-xs font-bold tracking-wider uppercase select-none">
                {activeIndex + 1} / {timelineEvents.length}
              </span>

              <button
                onClick={handleNext}
                disabled={activeIndex === timelineEvents.length - 1}
                className="bg-canvas border-border text-text hover:border-text disabled:hover:border-border focus-visible:outline-brand cursor-pointer rounded-full border p-3 transition-all focus-visible:outline focus-visible:outline-2 disabled:opacity-40"
                aria-label="Next Slide"
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
          </div>
        </Container>
      </section>
    </div>
  );
}
