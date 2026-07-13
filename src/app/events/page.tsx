"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { events } from "@/utils/eventData";

export default function EventsPage() {
  const upcomingEvents = events.filter((e) => e.type === "upcoming");
  const pastEvents = events.filter((e) => e.type === "past");
  const nextEvent = upcomingEvents[0]; // Nearest upcoming event for countdown

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [mounted, setMounted] = useState(false);

  // Lightbox State for past event galleries
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const lightboxRef = useRef<HTMLDialogElement>(null);

  // Video recap state (maps eventId -> playing boolean)
  const [playingVideoId, setPlayingVideoId] = useState<Record<string, boolean>>({});

  // Countdown Timer Logic
  useEffect(() => {
    setMounted(true);
    if (!nextEvent || !nextEvent.countdownTarget) return;

    const targetDate = new Date(nextEvent.countdownTarget).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: d.toString().padStart(2, "0"),
        hours: h.toString().padStart(2, "0"),
        minutes: m.toString().padStart(2, "0"),
        seconds: s.toString().padStart(2, "0"),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextEvent]);

  // Lightbox handlers
  const openPhoto = (photoUrl: string) => {
    setActivePhoto(photoUrl);
    lightboxRef.current?.showModal();
  };

  const closePhoto = () => {
    lightboxRef.current?.close();
    setActivePhoto(null);
  };

  const handlePlayRecap = (eventId: string) => {
    setPlayingVideoId((prev) => ({
      ...prev,
      [eventId]: true,
    }));
  };

  return (
    <div className="bg-canvas text-text flex-1 transition-colors duration-200">
      {/* 1. Countdown Hero Dashboard */}
      {nextEvent && (
        <section className="bg-canvas-muted border-border relative overflow-hidden border-b py-20 sm:py-28">
          <Container className="relative z-10 flex flex-col items-center text-center">
            <span className="text-brand text-xs font-bold tracking-widest uppercase">
              กิจกรรมที่กำลังจะเกิดขึ้นเร็วๆ นี้
            </span>
            <h1 className="text-text mt-3 max-w-2xl text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              {nextEvent.title}
            </h1>
            <p className="text-text-muted mt-4 max-w-md text-sm sm:text-base">
              {nextEvent.description}
            </p>

            {/* Countdown Grid */}
            <div className="mt-12 grid w-full max-w-xl grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: "วัน", val: mounted ? timeLeft.days : "--" },
                { label: "ชั่วโมง", val: mounted ? timeLeft.hours : "--" },
                { label: "นาที", val: mounted ? timeLeft.minutes : "--" },
                { label: "วินาที", val: mounted ? timeLeft.seconds : "--" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-canvas border-border group relative flex flex-col items-center justify-center rounded-3xl border p-4 shadow-sm sm:p-6"
                >
                  <span className="text-text text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                    {item.val}
                  </span>
                  <span className="text-text-muted mt-2 text-[10px] font-bold tracking-wider uppercase sm:text-xs">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Location & Time Info */}
            <div className="text-text-muted mt-10 flex flex-col items-center gap-6 text-sm font-semibold sm:flex-row">
              <span className="flex items-center gap-2">
                <svg
                  className="text-brand h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {nextEvent.date} &bull; {nextEvent.time}
              </span>
              <span className="text-border hidden sm:inline">|</span>
              <span className="flex items-center gap-2">
                <svg
                  className="text-brand h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
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
                {nextEvent.location}
              </span>
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                variant="primary"
                onClick={() => alert("เพิ่มลงในปฏิทินเรียบร้อยแล้ว (จำลอง)")}
              >
                เพิ่มลงปฏิทิน
              </Button>
              <Button
                variant="outline"
                onClick={() => alert("ลงทะเบียนเข้าร่วมงานออนไลน์เรียบร้อยแล้ว (จำลอง)")}
              >
                ลงทะเบียนร่วมงาน
              </Button>
            </div>
          </Container>
          {/* Subtle bg mesh glow */}
          <div className="bg-brand/10 pointer-events-none absolute -top-32 -left-32 h-64 w-64 rounded-full blur-3xl" />
        </section>
      )}

      {/* 2. Modern Timeline Section */}
      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeader
            title="กำหนดการและไทม์ไลน์กิจกรรม"
            subtitle="ติดตามข่าวสาร กิจกรรมรุ่น และการจัดงานคืนสู่เหย้าในรูปแบบไทม์ไลน์อย่างเป็นระเบียบ"
          />

          {/* Timeline Path */}
          <div className="border-border relative ml-4 space-y-16 border-l pl-10 sm:ml-8 sm:pl-12 md:ml-12">
            {events
              .slice()
              .reverse() // Sort chronologically (May -> August)
              .map((event) => {
                const isUpcoming = event.type === "upcoming";

                return (
                  <div key={event.id} className="group relative">
                    {/* Timeline Node Icon/Dot */}
                    <div className="bg-canvas ring-canvas absolute top-1.5 -left-[51px] flex h-6 w-6 items-center justify-center rounded-full ring-8 sm:-left-[59px]">
                      {isUpcoming ? (
                        <div className="bg-brand border-canvas ring-brand h-3 w-3 animate-pulse rounded-full border-2 ring-2" />
                      ) : (
                        <div className="bg-border text-canvas flex h-5 w-5 items-center justify-center rounded-full">
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Timeline Event Details */}
                    <div className="max-w-3xl">
                      <span className="flex items-center gap-3 text-xs font-bold tracking-wider uppercase">
                        <span className={isUpcoming ? "text-brand" : "text-text-muted"}>
                          {isUpcoming ? "กิจกรรมใหม่" : "ผ่านไปแล้ว"}
                        </span>
                        <span className="bg-border h-1.5 w-1.5 rounded-full" />
                        <span className="text-text-muted">{event.phase}</span>
                      </span>

                      <h3 className="text-text group-hover:text-brand mt-2 text-2xl font-bold tracking-tight transition-colors">
                        {event.title}
                      </h3>

                      <p className="text-text-muted mt-3 text-sm leading-relaxed sm:text-base">
                        {event.description}
                      </p>

                      {/* Timeline location chip */}
                      <div className="text-text-muted mt-4 flex items-center gap-2 text-xs font-medium">
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        {event.location} &bull; {event.date}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </Container>
      </section>

      {/* 3. Past Events Archive */}
      <section className="bg-canvas-muted border-border border-t py-24 sm:py-32">
        <Container>
          <SectionHeader
            title="คลังความทรงจำกิจกรรมที่ผ่านมา"
            subtitle="ประมวลภาพประทับใจ คลังรูปถ่าย และคลิปไฮไลท์บรรยากาศกิจกรรมที่พวกเราจัดทำร่วมกันสำเร็จแล้ว"
          />

          <div className="space-y-16">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="bg-canvas border-border hover:border-text-muted relative grid gap-8 overflow-hidden rounded-3xl border p-6 shadow-sm transition-all duration-300 sm:p-10 lg:grid-cols-12"
              >
                {/* Visual Video Embed / Cover Image */}
                <div className="relative flex aspect-video min-h-[240px] w-full items-center justify-center overflow-hidden rounded-2xl bg-black lg:col-span-6">
                  {event.videoUrl && playingVideoId[event.id] ? (
                    <iframe
                      className="absolute inset-0 h-full w-full border-0"
                      src={`https://www.youtube.com/embed/${event.videoUrl}?autoplay=1`}
                      title={event.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <Image
                        src={event.coverImage}
                        alt={event.title}
                        fill
                        className="object-cover opacity-75"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        loading="lazy"
                      />
                      {event.videoUrl && (
                        <button
                          onClick={() => handlePlayRecap(event.id)}
                          className="bg-canvas/90 border-border text-text focus-visible:outline-brand absolute z-10 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border backdrop-blur-sm transition-all hover:scale-105 focus-visible:outline focus-visible:outline-2 active:scale-95"
                          aria-label={`Play recap video for ${event.title}`}
                        >
                          <svg className="ml-1 h-6 w-6 fill-current" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      )}
                      <span className="absolute top-4 left-4 z-10 rounded-full border border-white/10 bg-black/60 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-sm">
                        วิดีโอสรุปกิจกรรม
                      </span>
                    </>
                  )}
                </div>

                {/* Event text descriptions, location, and inline galleries */}
                <div className="flex flex-col justify-between lg:col-span-6">
                  <div>
                    <span className="text-text-muted text-[10px] font-bold tracking-wider uppercase">
                      {event.phase}
                    </span>
                    <h3 className="text-text mt-2 text-2xl font-bold tracking-tight">
                      {event.title}
                    </h3>
                    <p className="text-text-muted mt-3 text-sm leading-relaxed">
                      {event.description}
                    </p>

                    <div className="text-text-muted mt-4 flex flex-wrap gap-4 text-xs font-medium">
                      <span className="flex items-center gap-1">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        {event.location}
                      </span>
                    </div>
                  </div>

                  {/* Inline Event Photo Gallery */}
                  <div className="border-border mt-6 border-t pt-6">
                    <span className="text-text-muted mb-3 block text-[10px] font-bold tracking-widest uppercase">
                      คลังภาพประดับใจในงาน
                    </span>
                    <div className="flex scrollbar-none gap-3 overflow-x-auto pb-2">
                      {event.galleryImages.map((imgUrl, imgIdx) => (
                        <div
                          key={imgIdx}
                          onClick={() => openPhoto(imgUrl)}
                          className="border-border hover:border-text-muted relative h-16 w-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border transition-all active:scale-95"
                        >
                          <Image
                            src={imgUrl}
                            alt={`Gallery image ${imgIdx + 1}`}
                            fill
                            className="object-cover"
                            sizes="96px"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Full-Screen Image Lightbox modal */}
      <dialog
        ref={lightboxRef}
        className="border-border bg-canvas/98 h-[75vh] w-[92%] max-w-4xl overflow-hidden rounded-3xl border p-0 shadow-2xl backdrop-blur-lg outline-none select-none backdrop:bg-black/90 backdrop:backdrop-blur-md"
        onClose={closePhoto}
      >
        <div className="relative flex h-full w-full flex-col justify-between bg-black/40 p-4">
          <div className="z-30 flex justify-end">
            <button
              onClick={closePhoto}
              className="focus-visible:outline-brand cursor-pointer rounded-full border border-white/10 bg-black/40 p-2 text-neutral-300 hover:bg-black/60 hover:text-white focus-visible:outline focus-visible:outline-2"
              aria-label="Close Preview"
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

          <div className="relative flex max-h-[60vh] flex-1 items-center justify-center">
            {activePhoto && (
              <div className="relative h-full w-full">
                <Image
                  src={activePhoto}
                  alt="Gallery preview"
                  fill
                  className="animate-in zoom-in-95 object-contain duration-200"
                  sizes="80vw"
                  priority
                />
              </div>
            )}
          </div>

          <div className="flex h-10 items-center justify-center text-xs font-medium text-neutral-400">
            แกลเลอรีภาพกิจกรรม รุ่น SK150
          </div>
        </div>
      </dialog>
    </div>
  );
}
