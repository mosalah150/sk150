import { EventItem } from "@/types/event";

export const events: EventItem[] = [
  {
    id: "1",
    title: "SK150 App Router Hackathon",
    description:
      "A 48-hour collaborative build sprint challenging developers to build responsive design blocks and fast server component routes.",
    type: "upcoming",
    date: "July 24, 2026",
    time: "10:00 AM UTC",
    location: "Discord Dev Stage & Zoom",
    locationType: "virtual",
    countdownTarget: "2026-07-24T10:00:00.000Z", // Future date relative to July 12, 2026
    coverImage: "/assets/gallery_2.png",
    galleryImages: ["/assets/gallery_2.png", "/assets/gallery_5.png"],
    phase: "Phase 1: Component Sprints",
  },
  {
    id: "2",
    title: "Tailwind CSS v4 Deep Dive Workshop",
    description:
      "Explore dynamic theme variables, light-dark() CSS queries, custom scrollbars, and high-performance paint rendering pipeline.",
    type: "upcoming",
    date: "August 12, 2026",
    time: "2:00 PM UTC",
    location: "Gather.town Space",
    locationType: "virtual",
    countdownTarget: "2026-08-12T14:00:00.000Z",
    coverImage: "/assets/gallery_1.png",
    galleryImages: ["/assets/gallery_1.png", "/assets/gallery_4.png"],
    phase: "Phase 2: Theme Compilations",
  },
  {
    id: "3",
    title: "Next.js 15 Alpha Architecture Launch",
    description:
      "Introducing the foundation architecture, FlatCompat ESLint rules, and edge routing compliance on Cloudflare serverless workers.",
    type: "past",
    date: "June 15, 2026",
    time: "6:00 PM PST",
    location: "Vercel Spaces, San Francisco",
    locationType: "physical",
    coverImage: "/assets/gallery_4.png",
    galleryImages: ["/assets/gallery_4.png", "/assets/gallery_5.png", "/assets/gallery_2.png"],
    videoUrl: "dQw4w9WgXcQ", // YouTube embed recap
    phase: "Platform Kickoff",
  },
  {
    id: "4",
    title: "Community Sync & Onboarding Hack",
    description:
      "Bootstrapping the network, aligning local verification environments, and checking development workflows in under 4 seconds.",
    type: "past",
    date: "May 20, 2026",
    time: "4:00 PM UTC",
    location: "Discord Audio Stage",
    locationType: "virtual",
    coverImage: "/assets/gallery_1.png",
    galleryImages: ["/assets/gallery_1.png", "/assets/gallery_2.png"],
    videoUrl: "dQw4w9WgXcQ",
    phase: "Network Bootup",
  },
];
