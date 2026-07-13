import { Video } from "@/types/media";

export const videos: Video[] = [
  {
    id: "1",
    title: "SK150 Core Platform Walkthrough",
    description:
      "A complete guide to our repository directory structure, Next.js 15 App Router routing paths, and custom Tailwind v4 setups.",
    platform: "youtube",
    videoId: "dQw4w9WgXcQ", // YouTube standard placeholder id
    category: "Tutorials",
    duration: "12:45",
    date: "July 12, 2026",
    coverImage: "/assets/gallery_2.png",
  },
  {
    id: "2",
    title: "Designing for Apple, Medium & Nike Aesthetics",
    description:
      "Our frontend design leads explain how to leverage whitespace, large typography, and glassmorphism overlays to build premium websites.",
    platform: "youtube",
    videoId: "dQw4w9WgXcQ",
    category: "Panel Talks",
    duration: "18:20",
    date: "July 08, 2026",
    coverImage: "/assets/gallery_3.png",
  },
  {
    id: "3",
    title: "Building next-on-pages Edge Deployments",
    description:
      "A deep dive covering compile processes, route bundle tracing, and deploying Next.js 15 directly to Cloudflare Pages at the edge.",
    platform: "youtube",
    videoId: "dQw4w9WgXcQ",
    category: "Tutorials",
    duration: "14:10",
    date: "July 04, 2026",
    coverImage: "/assets/gallery_1.png",
  },
  {
    id: "4",
    title: "Tailwind CSS v4 Variables in 60 Seconds",
    description:
      "Quick summary showing how Tailwind v4 maps theme elements directly to standard CSS properties without heavy config files.",
    platform: "tiktok",
    videoId: "6073829102381290382", // Mock TikTok Video ID
    category: "Creative Highlights",
    duration: "1:00",
    date: "July 09, 2026",
    coverImage: "/assets/gallery_4.png",
  },
  {
    id: "5",
    title: "Preventing FOUC in Next.js 15 Dark Mode",
    description:
      "How to inject high-performance headers and local storage theme indicators to prevent visual flashes on light/dark switches.",
    platform: "tiktok",
    videoId: "6073829102381290382",
    category: "Creative Highlights",
    duration: "0:58",
    date: "July 06, 2026",
    coverImage: "/assets/gallery_5.png",
  },
];
