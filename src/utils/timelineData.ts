import { TimelineEvent } from "@/types/timeline";

export const timelineEvents: TimelineEvent[] = [
  {
    id: "orientation",
    title: "Orientation",
    subtitle: "Starting the Engine",
    date: "May 10, 2026",
    description:
      "The onboarding checkpoint. Setting up local environments, checking developer dependencies, and checking repository config options.",
    imageSrc: "/assets/gallery_2.png",
    tags: ["Setup", "Onboarding", "Platform"],
    phase: "Milestone 01",
    bullets: [
      "Initialize base repository directories",
      "Configure local verification targets",
      "Establish FlatCompat ESLint structures",
    ],
  },
  {
    id: "sports-day",
    title: "Sports Day",
    subtitle: "Aesthetic Motion",
    date: "June 02, 2026",
    description:
      "Tracking athlete performance. A study focusing on high-speed blur effects, custom scrollbars, and Nike-inspired physics animations.",
    imageSrc: "/assets/gallery_3.png",
    tags: ["Motion", "Performance", "Nike"],
    phase: "Milestone 02",
    bullets: [
      "Implement transform-only animations to avoid reflows",
      "Map user motion preference overrides natively",
      "Minimize input latency offsets",
    ],
  },
  {
    id: "camp",
    title: "Camp",
    subtitle: "Edge Hack Cabin",
    date: "June 25, 2026",
    description:
      "Collaborative coding cabin. Structuring layout schemas, database integrations, and dynamic routing logic in local developer sandboxes.",
    imageSrc: "/assets/gallery_5.png",
    tags: ["Collaboration", "Hackathon", "Build"],
    phase: "Milestone 03",
    bullets: [
      "Mock core database components statically",
      "Establish server routing folders",
      "Build reusable typography elements",
    ],
  },
  {
    id: "music",
    title: "Music",
    subtitle: "Sound & Lighting Labs",
    date: "July 08, 2026",
    description:
      "Acoustic and ambient design. Crafting dark theme color palettes, hardware-accelerated glass backdrop-filters, and glow gradients.",
    imageSrc: "/assets/gallery_1.png",
    tags: ["Design", "Glassmorphism", "Apple"],
    phase: "Milestone 04",
    bullets: [
      "Refine oklch translucent overlay colors",
      "Implement GPU isolation layers using transform bounds",
      "Prevent FOUC layout flashes in client headers",
    ],
  },
  {
    id: "graduation",
    title: "Graduation",
    subtitle: "Production Launch",
    date: "July 24, 2026",
    description:
      "Deploying to global Pages isolates. Compiling static site templates and routing bundles to Cloudflare V8 serverless edge nodes.",
    imageSrc: "/assets/gallery_4.png",
    tags: ["DevOps", "Cloudflare", "Launch"],
    phase: "Milestone 05",
    bullets: [
      "Generate dynamic sitemaps for indexing",
      "Audit compilation bundles for static rendering",
      "Establish platform handshake deploy routines",
    ],
  },
];
