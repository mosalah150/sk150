"use client";

import React, { useState } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { useDynamicData } from "@/providers/DynamicDataProvider";

type CategoryFilter =
  | "All"
  | "งานจบการศึกษา"
  | "กีฬาสีและกิจกรรม"
  | "แคมป์ปิ้งดนตรี"
  | "ความทรงจำสั้นๆ"
  | "กีฬาโรงเรียน";

const filterLabels: Record<CategoryFilter, string> = {
  All: "ทั้งหมด",
  งานจบการศึกษา: "งานจบการศึกษา",
  กีฬาสีและกิจกรรม: "กีฬาสีและกิจกรรม",
  แคมป์ปิ้งดนตรี: "แคมป์ปิ้งดนตรี",
  ความทรงจำสั้นๆ: "ความทรงจำสั้นๆ",
  กีฬาโรงเรียน: "กีฬาโรงเรียน",
};

export default function MediaCenterPage() {
  const { media } = useDynamicData();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");

  // Track playing video IDs to swap placeholder cover cards with actual iframe players
  const [playingVideoIds, setPlayingVideoIds] = useState<Record<string, boolean>>({});

  const featuredVideo = media[0];

  const handlePlayClick = (id: string) => {
    setPlayingVideoIds((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const filteredVideos = media.filter(
    (video) => activeCategory === "All" || video.category === activeCategory,
  );

  const categories: CategoryFilter[] = [
    "All",
    "งานจบการศึกษา",
    "กีฬาสีและกิจกรรม",
    "แคมป์ปิ้งดนตรี",
    "ความทรงจำสั้นๆ",
    "กีฬาโรงเรียน",
  ];

  return (
    <div className="bg-canvas text-text flex-1 transition-colors duration-200">
      {/* 1. Header & Featured Player Area */}
      <section className="bg-canvas-muted border-border border-b py-16 sm:py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <span className="text-brand text-xs font-bold tracking-widest uppercase">
              คลังวิดีโอ
            </span>
            <h1 className="text-text mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              ศูนย์รวมวิดีโอรุ่น
            </h1>
            <p className="text-text-muted mt-4 text-lg leading-relaxed">
              รับชมบันทึกภาพเคลื่อนไหวการทำกิจกรรม ค่ายดนตรีฤดูร้อน ไฮไลท์การเชียร์แปลอักษรชมพู-ฟ้า และพิธีปัจฉิมจบการศึกษาของพวกเรา สวนกุหลาบวิทยาลัย รุ่น 150 (ผู้นำแห่งอนาคต Future Leaders)
            </p>
          </div>

          {/* Featured Video Player Block */}
          {featuredVideo && (
            <div className="border-border bg-canvas hover:border-text-muted relative overflow-hidden rounded-3xl border shadow-xl transition-all duration-300">
              <div className="grid lg:grid-cols-12">
                {/* Image Cover / Interactive Iframe Player */}
                <div className="relative flex aspect-video min-h-[360px] w-full items-center justify-center overflow-hidden bg-black lg:col-span-8">
                  {playingVideoIds[featuredVideo.id] ? (
                    <iframe
                      className="absolute inset-0 h-full w-full border-0"
                      src={`https://www.youtube.com/embed/${featuredVideo.videoId}?autoplay=1`}
                      title={featuredVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <Image
                        src={featuredVideo.coverImage}
                        alt={featuredVideo.title}
                        fill
                        priority
                        className="object-cover opacity-80"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                      />
                      {/* Play Button Overlay */}
                      <button
                        onClick={() => handlePlayClick(featuredVideo.id)}
                        className="bg-canvas/90 border-border text-text focus-visible:outline-brand absolute z-10 flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-all hover:scale-105 focus-visible:outline focus-visible:outline-2 active:scale-95"
                        aria-label={`Play video: ${featuredVideo.title}`}
                      >
                        <svg className="ml-1.5 h-8 w-8 fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                      {/* Platform Label Badge */}
                      <span className="absolute top-6 left-6 z-10 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase backdrop-blur-sm">
                        {featuredVideo.platform === "youtube" ? "YouTube" : "TikTok"}
                      </span>
                      {/* Video Duration Badge */}
                      <span className="absolute right-6 bottom-6 z-10 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                        {featuredVideo.duration}
                      </span>
                    </>
                  )}
                </div>

                {/* Video Info Details */}
                <div className="flex flex-col justify-between p-8 lg:col-span-4">
                  <div>
                    <span className="text-brand text-xs font-bold tracking-widest uppercase">
                      วิดีโอเด่นความทรงจำ
                    </span>
                    <h2 className="text-text mt-3 text-2xl font-black tracking-tight">
                      {featuredVideo.title}
                    </h2>
                    <p className="text-text-muted mt-4 text-xs leading-relaxed sm:text-sm">
                      {featuredVideo.description}
                    </p>
                  </div>
                  <div className="border-border text-text-muted mt-8 flex items-center justify-between border-t pt-6 text-xs font-medium">
                    <span>{featuredVideo.category}</span>
                    <span>{featuredVideo.date}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* 2. Directory Toggles & Cards Grid */}
      <section className="py-20">
        <Container>
          {/* Category Tabs */}
          <div className="border-border mb-12 flex scrollbar-none items-center gap-2 overflow-x-auto border-b pb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`focus-visible:outline-brand cursor-pointer rounded-full px-5 py-2 text-sm font-semibold whitespace-nowrap transition-all focus-visible:outline focus-visible:outline-2 ${
                  activeCategory === category
                    ? "bg-text text-canvas"
                    : "bg-canvas text-text-muted hover:bg-canvas-muted hover:text-text border-border hover:border-text-muted border"
                }`}
              >
                {filterLabels[category]}
              </button>
            ))}
          </div>

          <SectionHeader
            title={`วิดีโอหมวดหมู่: ${filterLabels[activeCategory]}`}
            subtitle="เลือกคลิกเล่นวิดีโอความประทับใจเพื่อหวนระลึกถึงบรรยากาศการทำกิจกรรมร่วมกัน"
          />

          {filteredVideos.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="border-border bg-canvas group hover:border-text-muted flex flex-col overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Player Frame / Image Cover */}
                  <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-black">
                    {playingVideoIds[video.id] ? (
                      video.platform === "youtube" ? (
                        <iframe
                          className="absolute inset-0 h-full w-full border-0"
                          src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <iframe
                          className="absolute inset-0 h-full w-full border-0"
                          src={`https://www.tiktok.com/embed/v2/${video.videoId}`}
                          title={video.title}
                          allowFullScreen
                        />
                      )
                    ) : (
                      <>
                        <Image
                          src={video.coverImage}
                          alt={video.title}
                          fill
                          className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-102"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          loading="lazy"
                        />
                        {/* Custom Play button trigger */}
                        <button
                          onClick={() => handlePlayClick(video.id)}
                          className="bg-canvas/90 border-border text-text focus-visible:outline-brand absolute z-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border shadow-md backdrop-blur-sm transition-all hover:scale-105 focus-visible:outline focus-visible:outline-2 active:scale-95"
                          aria-label={`Play video: ${video.title}`}
                        >
                          <svg className="ml-1 h-6 w-6 fill-current" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                        {/* Platform Badge overlay */}
                        <span className="absolute top-4 left-4 z-10 rounded-full border border-white/10 bg-black/60 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-sm">
                          {video.platform === "youtube" ? "YouTube" : "TikTok"}
                        </span>
                        {/* Duration badge overlay */}
                        <span className="absolute right-4 bottom-4 z-10 rounded-full border border-white/10 bg-black/60 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                          {video.duration}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Video Metadata Content */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <span className="text-brand text-[10px] font-bold tracking-wider uppercase">
                        {video.category}
                      </span>
                      <h4 className="text-text mt-2 line-clamp-2 text-lg leading-snug font-bold">
                        {video.title}
                      </h4>
                      <p className="text-text-muted mt-2 line-clamp-2 text-xs leading-relaxed sm:text-sm">
                        {video.description}
                      </p>
                    </div>
                    <div className="border-border text-text-muted mt-6 border-t pt-4 text-[11px] font-medium">
                      {video.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-border bg-canvas-muted rounded-3xl border py-16 text-center">
              <p className="text-text-muted text-lg">ไม่พบวิดีโอความประทับใจในหมวดหมู่นี้</p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
