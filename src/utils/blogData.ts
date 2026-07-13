import { Article } from "@/types/blog";

export const articles: Article[] = [
  {
    id: "1",
    slug: "redefining-high-performance-in-modern-web-applications",
    title: "Redefining High Performance in Modern Web Applications",
    description:
      "How rendering constraints, layout offsets, and oklch paint cycles are changing the way we write client-side layouts.",
    imageSrc: "/assets/gallery_2.png",
    category: "Performance",
    tags: ["Next.js", "WebPerf", "Edge", "Tailwind"],
    date: "July 10, 2026",
    readTime: "5 min read",
    publishedTime: "2026-07-10T10:00:00.000Z",
    author: {
      name: "Alex Thorne",
      avatar: "/assets/spotlight.png",
      title: "Core Infrastructure Lead",
    },
    content: [
      "In the world of modern web development, speed is no longer just a luxury—it is the foundation of user retention and conversion. As web engines evolve, the metrics we use to track performance have shifted. We are no longer simply looking at raw load times; we are tracking visual stability, layout stability, and runtime input latency.",
      "Largest Contentful Paint (LCP) and Interaction to Next Paint (INP) are the new standards governing layout performance. When building SK150, we realized that standard configurations often introduce layout bottlenecks, blocking main thread paint operations. Standard client-side hydration frequently delays interaction responses.",
      "By utilizing Next.js 15 server component layouts combined with Tailwind CSS v4, we can drastically reduce bundle sizes. Tailwind v4's direct CSS compilation does away with heavy runtime JavaScript stylesheets, injecting styles natively at compile time. This allows the browser to paint components immediately upon receiving document fragments.",
      "Furthermore, leveraging Cloudflare Pages to render and cache at the edge reduces time-to-first-byte (TTFB) to single-digit milliseconds. When static pages are served from a server node closest to the client, the paint pipeline is completed before the user even has time to scroll.",
    ],
  },
  {
    id: "2",
    slug: "the-anatomy-of-glassmorphic-and-transparent-interfaces",
    title: "The Anatomy of Glassmorphic & Transparent Interfaces",
    description:
      "A technical guide to implementing hardware-accelerated CSS backdrop-filters while handling hydration mismatches safely.",
    imageSrc: "/assets/gallery_1.png",
    category: "Design",
    tags: ["CSS", "DesignSystems", "Aesthetics", "Apple"],
    date: "July 08, 2026",
    readTime: "8 min read",
    publishedTime: "2026-07-08T09:30:00.000Z",
    author: {
      name: "Maya Henderson",
      avatar: "/assets/spotlight.png",
      title: "Lead Visual Architect",
    },
    content: [
      "Visually textures and translucent layers have defined modern Apple and premium design systems for years. Glassmorphism creates a sense of depth, grouping floating panels while keeping the user connected to the background canvas. However, rendering glass effects on the web is notoriously resource-heavy if done incorrectly.",
      "The core CSS properties involved are `backdrop-filter: blur(...)` combined with translucent background custom colors (`rgba` or modern `oklch` with alpha values). When browsers calculate blurred backdrops, they must perform graphical pixel-shading routines. If these elements scroll or animate frequently, it can cause severe scroll jitter and layout lag.",
      "To prevent layout lag, visual layers should always be isolated in their own compositing layers using GPU acceleration indicators like `will-change: transform` or `transform: translate3d(0,0,0)`. This tells the graphics processor to rasterize the element independently, avoiding recursive page repaint cycles.",
      "Additionally, when server-side rendering (SSR) translucent components, hydration shifts can occur. To avoid layout flashes, we rely on inline color-scheme metadata overrides and mounted checks. By declaring the supported themes early in the header, components render with stable translucent colors without flashing unstyled templates.",
    ],
  },
  {
    id: "3",
    slug: "why-we-standardized-sk150-on-cloudflare-pages",
    title: "Why We Standardized SK150 on Cloudflare Pages",
    description:
      "Unlocking instant worldwide deployments, Edge compute runtimes, and local compatibility checkups in under 4 seconds.",
    imageSrc: "/assets/hero_bg.png",
    category: "DevOps",
    tags: ["Cloudflare", "Next.js", "Serverless", "Edge"],
    date: "July 05, 2026",
    readTime: "4 min read",
    publishedTime: "2026-07-05T14:15:00.000Z",
    author: {
      name: "Marcus Vance",
      avatar: "/assets/spotlight.png",
      title: "Systems Operations Lead",
    },
    content: [
      "Deploying modern frontend applications has evolved beyond central data centers. Users expect instant document retrieval regardless of geographic location. Traditional server hosting models introduce routing latency, routing packets across continents.",
      "Standardizing on Cloudflare Pages gives us access to a global network spanning over 300 cities. Next.js 15 apps deploy as serverless Edge functions using the `@cloudflare/next-on-pages` builder. This compiles routing endpoints into lightweight V8 worker isolates rather than heavy node runtimes.",
      "These V8 isolates start in under 10 milliseconds, eliminating cold start delays common in serverless containers. Since assets are cached directly on Cloudflare's edge nodes, clients retrieve styles, scripts, and layout markup almost instantly.",
      "By integrating a strict local checking pipeline, we ensure that every code build matches the Edge environment before push. Developers run local compilation and Edge environment emulation in under 4 seconds, verifying compatibility before deploying to production pages.",
    ],
  },
  {
    id: "4",
    slug: "the-art-of-high-speed-motion-design-systems",
    title: "The Art of High-Speed Motion Design Systems",
    description:
      "Aesthetic athlete motion studies focusing on high-speed blur, layout lines, and premium sport visuals.",
    imageSrc: "/assets/gallery_3.png",
    category: "Sports",
    tags: ["Motion", "Aesthetics", "Nike", "UX"],
    date: "July 01, 2026",
    readTime: "6 min read",
    publishedTime: "2026-07-01T11:00:00.000Z",
    author: {
      name: "Maya Henderson",
      avatar: "/assets/spotlight.png",
      title: "Lead Visual Architect",
    },
    content: [
      "Nike's marketing and visual style has always been about energy, momentum, and motion. When transferring this feeling onto a digital interface, static cards and lists can feel uninspiring. Modern interfaces need to feel alive, responding to user actions with organic, physics-based transitions.",
      "Motion design systems define how objects scale, fade, and shift when interacting with pointers. However, animating heavy assets can challenge frame rates, especially on mobile devices. Standard layout properties like `height`, `width`, or `margin` trigger browser layout reflows, causing animations to drop below 60fps.",
      "To achieve smooth motion, animations should be restricted to `transform` and `opacity` properties. These can be processed entirely on the GPU compositing layer without forcing layout recalculations. Combined with CSS transition variables, cards slide and scale smoothly without lag.",
      "Furthermore, incorporating CSS variables matching user motion settings via `prefers-reduced-motion` is crucial. By automatically disabling heavy scale animations for users who prefer static transitions, we create a layout that is both visually stunning and fully inclusive.",
    ],
  },
];
