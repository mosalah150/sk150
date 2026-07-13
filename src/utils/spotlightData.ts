import { StudentProfile } from "@/types/spotlight";

export const studentProfiles: StudentProfile[] = [
  {
    id: "maya-henderson",
    name: "Maya Henderson",
    title: "Lead Visual Architect",
    achievement: "Aesthetic Design System Lead",
    imageSrc: "/assets/spotlight.png",
    instagram: "https://instagram.com/maya_visuals",
    tiktok: "https://tiktok.com/@maya_visuals",
    youtube: "https://youtube.com",
    highlightQuote:
      "Typography is the voice of the layout; color is its posture. Visual hierarchy should feel silent and deliberate.",
    metrics: [
      { label: "GPA Score", value: "4.0" },
      { label: "Systems Built", value: "4 Custom" },
      { label: "Theme Palettes", value: "150 Mapped" },
    ],
    bioParagraphs: [
      "Maya Henderson has spent the last three semesters redefining how we think about visual textures and layouts. Specializing in high-end glassmorphism and modern oklch color spaces, Maya led the core design sprint that established the aesthetic foundations of the SK150 platform.",
      "By looking closely at the product marketing of Apple and Nike, Maya realized that digital interfaces often compromise on whitespace. To combat this, she designed the modular section structure and customized bento blocks featured on our home page. This layout provides content layers with enough breathing room to feel premium.",
      "Looking forward, Maya is focusing her research on hardware-accelerated CSS animations. Her goal is to integrate fluid, physics-based transitions into everyday UI interfaces, proving that web layouts can scroll smoothly on mobile devices without dropping frame rates.",
    ],
  },
  {
    id: "alex-thorne",
    name: "Alex Thorne",
    title: "Core Infrastructure Lead",
    achievement: "Edge System Optimization Lead",
    imageSrc: "/assets/spotlight.png", // Reuse spotlight avatar asset
    instagram: "https://instagram.com/alex_code",
    tiktok: "https://tiktok.com/@alex_code",
    youtube: "https://youtube.com",
    highlightQuote:
      "Speed isn't just a performance metric; it's the fundamental user experience. If a page paints after 100ms, you've already lost the momentum.",
    metrics: [
      { label: "Edge TTFB", value: "8 ms" },
      { label: "Build Auditing", value: "Under 4s" },
      { label: "Serverless Workers", value: "50+ Deployed" },
    ],
    bioParagraphs: [
      "Alex Thorne is the engineering backbone of the SK150 performance team. With a passion for serverless compilation and edge caching architectures, Alex spearheaded our deployment migration from standard container hosting to Cloudflare Pages.",
      "His work involves configuring Next.js 15 routing parameters to compile directly as lightweight V8 isolates. By reducing routing latency and optimizing static asset caching at Cloudflare edge nodes, Alex successfully brought our global Time-To-First-Byte down to a single digit.",
      "When he's not auditing Next.js bundlers, Alex collaborates with visual designers to implement strict FOUC (Flash of Unstyled Content) prevention scripts. This work ensures that light/dark theme variables resolve instantly in under 3 milliseconds before browser paint cycles.",
    ],
  },
];
