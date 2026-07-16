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
                <div className={`relative flex w-full items-center justify-center overflow-hidden bg-black transition-all duration-300 lg:col-span-8 ${
                  featuredVideo.platform === "tiktok" ? "aspect-[9/16] max-w-[340px] mx-auto my-6 rounded-3xl" : "aspect-video min-h-[360px]"
                }`}>
                  {playingVideoIds[featuredVideo.id] ? (
                    featuredVideo.platform === "youtube" ? (
                      <iframe
                        className="absolute inset-0 h-full w-full border-0"
                        src={`https://www.youtube.com/embed/${featuredVideo.videoId}?autoplay=1`}
                        title={featuredVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : featuredVideo.platform === "tiktok" ? (
                      <iframe
                        className="absolute inset-0 h-full w-full border-0"
                        src={`https://www.tiktok.com/player/v1/${featuredVideo.videoId}`}
                        title={featuredVideo.title}
                        allowFullScreen
                      />
                    ) : (
                      <iframe
                        className="absolute inset-0 h-full w-full border-0"
                        src={`https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fwatch%2F%3Fv%3D${featuredVideo.videoId}&show_text=0&width=560`}
                        title={featuredVideo.title}
                        allowFullScreen
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      />
                    )
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
                        {featuredVideo.platform === "youtube" ? "YouTube" : featuredVideo.platform === "tiktok" ? "TikTok" : "Facebook"}
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
                    {(featuredVideo.platform === "facebook" || featuredVideo.platform === "facebook-reel") && (
                      <div className="mt-4">
                        <a
                          href={featuredVideo.platform === "facebook-reel"
                            ? `https://www.facebook.com/reel/${featuredVideo.videoId}`
                            : `https://www.facebook.com/watch/?v=${featuredVideo.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-brand/10 px-4 py-2 text-xs font-bold text-brand transition-colors hover:bg-brand/20"
                        >
                          <svg className="h-4 w-4 fill-current animate-pulse" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          เปิดดูโดยตรงใน Facebook App
                        </a>
                      </div>
                    )}
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
                  <div className={`relative flex w-full items-center justify-center overflow-hidden bg-black transition-all duration-300 ${
                    video.platform === "tiktok" ? "aspect-[9/16] max-w-[340px] mx-auto my-4 rounded-2xl" : "aspect-video"
                  }`}>
                    {playingVideoIds[video.id] ? (
                      video.platform === "youtube" ? (
                        <iframe
                          className="absolute inset-0 h-full w-full border-0"
                          src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : video.platform === "tiktok" ? (
                        <iframe
                          className="absolute inset-0 h-full w-full border-0"
                          src={`https://www.tiktok.com/player/v1/${video.videoId}`}
                          title={video.title}
                          allowFullScreen
                        />
                      ) : (
                        <iframe
                          className="absolute inset-0 h-full w-full border-0"
                          src={`https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fwatch%2F%3Fv%3D${video.videoId}&show_text=0&width=560`}
                          title={video.title}
                          allowFullScreen
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
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
                          {video.platform === "youtube" ? "YouTube" : video.platform === "tiktok" ? "TikTok" : "Facebook"}
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
                      {(video.platform === "facebook" || video.platform === "facebook-reel") && (
                        <div className="mt-3">
                          <a
                            href={video.platform === "facebook-reel"
                              ? `https://www.facebook.com/reel/${video.videoId}`
                              : `https://www.facebook.com/watch/?v=${video.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand/10 px-3 py-1.5 text-[11px] font-bold text-brand transition-colors hover:bg-brand/20"
                          >
                            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            เปิดดูใน Facebook App
                          </a>
                        </div>
                      )}
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
