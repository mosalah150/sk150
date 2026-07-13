import React from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function Home() {
  const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Platform Overview" }];

  return (
    <main
      id="content"
      tabIndex={-1}
      className="bg-canvas text-text flex min-h-screen flex-col transition-colors duration-200 outline-none"
    >
      {/* Breadcrumb Area */}
      <Container className="pt-6 pb-2">
        <Breadcrumb items={breadcrumbItems} />
      </Container>

      {/* 1. Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden py-24 sm:py-32">
        {/* LCP Optimized Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/hero_bg.png"
            alt="Sleek abstract technology background"
            fill
            priority
            fetchPriority="high"
            className="object-cover opacity-80 dark:opacity-60"
            sizes="100vw"
          />
          {/* Subtle Dark/Light Masks to guarantee contrast */}
          <div className="from-canvas via-canvas/50 absolute inset-0 bg-gradient-to-t to-transparent" />
          <div className="from-canvas/90 via-canvas/30 absolute inset-0 bg-gradient-to-r to-transparent" />
        </div>

        <Container className="relative z-10 w-full">
          <div className="max-w-3xl">
            <div className="border-brand/30 bg-brand/10 text-brand mb-8 inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm">
              SYSTEM PLATFORM &bull; NEXT-GEN DEVELOPER PLAYGROUND
            </div>
            <h1 className="text-text text-5xl leading-[1.05] font-black tracking-tighter uppercase sm:text-6xl md:text-7xl lg:text-8xl">
              The future is <span className="text-brand">built</span>.<br />
              Not inherited.
            </h1>
            <p className="text-text-muted mt-8 max-w-xl text-lg leading-relaxed font-normal sm:text-xl">
              SK150 brings together the next generation of designers, developers, and software
              craftsmen to shape the visual and digital landscapes of tomorrow.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button variant="primary" size="lg">
                Explore Platform
              </Button>
              <Button variant="glass" size="lg">
                Watch Launch Film
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Latest Stories Section */}
      <section id="stories" className="border-border border-t py-24 sm:py-32">
        <Container>
          <SectionHeader
            title="Latest Stories"
            subtitle="Deep dives, design paradigms, and insights from our build team."
            ctaText="Read all articles"
            ctaHref="#stories"
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              title="Redefining High Performance in Modern Web Applications"
              description="How rendering constraints, layout offsets, and oklch paint cycles are changing the way we write client-side layouts."
              date="July 10, 2026"
              readTime="5 min read"
              badge="Design Systems"
              href="#stories"
              aspectRatio="video"
            />
            <Card
              title="The Anatomy of Glassmorphic & Transparent Interfaces"
              description="A technical guide to implementing hardware-accelerated CSS backdrop-filters while handling hydration mismatches safely."
              date="July 08, 2026"
              readTime="8 min read"
              badge="User Interface"
              href="#stories"
              aspectRatio="video"
            />
            <Card
              title="Why We Standardized SK150 on Cloudflare Pages"
              description="Unlocking instant worldwide deployments, Edge compute runtimes, and local compatibility checkups in under 4 seconds."
              date="July 05, 2026"
              readTime="4 min read"
              badge="DevOps"
              href="#stories"
              aspectRatio="video"
            />
          </div>
        </Container>
      </section>

      {/* 3. Upcoming Events Section */}
      <section
        id="events"
        className="bg-canvas-muted border-border border-t border-b py-24 sm:py-32"
      >
        <Container>
          <SectionHeader
            title="Upcoming Events"
            subtitle="Join our active community in live sessions, workshops, and build hacks."
            ctaText="View full schedule"
            ctaHref="#events"
          />
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Event Card 1 */}
            <div className="border-border bg-canvas group hover:border-text-muted relative flex flex-col gap-6 overflow-hidden rounded-3xl border p-8 transition-all duration-300 sm:flex-row">
              <div className="bg-brand/10 border-brand/20 text-brand flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center rounded-2xl border">
                <span className="text-2xl font-black">24</span>
                <span className="text-xs font-bold tracking-widest uppercase">Jul</span>
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <span className="text-brand text-xs font-semibold tracking-wider uppercase">
                    Hackathon
                  </span>
                  <h3 className="text-text mt-1 text-2xl font-bold tracking-tight">
                    SK150 App Router Hack
                  </h3>
                  <p className="text-text-muted mt-2 text-sm leading-relaxed">
                    Build dynamic visual components using Next.js 15 and Tailwind CSS v4 in a
                    48-hour sprint. Collaborations welcome.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-text-muted text-xs font-medium">
                    10:00 AM &bull; Discord Live
                  </span>
                  <Button variant="outline" size="sm">
                    Register
                  </Button>
                </div>
              </div>
            </div>

            {/* Event Card 2 */}
            <div className="border-border bg-canvas group hover:border-text-muted relative flex flex-col gap-6 overflow-hidden rounded-3xl border p-8 transition-all duration-300 sm:flex-row">
              <div className="bg-brand/10 border-brand/20 text-brand flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center rounded-2xl border">
                <span className="text-2xl font-black">12</span>
                <span className="text-xs font-bold tracking-widest uppercase">Aug</span>
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <span className="text-brand text-xs font-semibold tracking-wider uppercase">
                    Workshop
                  </span>
                  <h3 className="text-text mt-1 text-2xl font-bold tracking-tight">
                    Tailwind CSS v4 Deep Dive
                  </h3>
                  <p className="text-text-muted mt-2 text-sm leading-relaxed">
                    Explore dynamic variable mapping, custom `@theme` configuration, and
                    light-dark() CSS engine integrations.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-text-muted text-xs font-medium">
                    2:00 PM &bull; Zoom Virtual
                  </span>
                  <Button variant="outline" size="sm">
                    Register
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Featured Gallery (Bento Style) */}
      <section id="gallery" className="py-24 sm:py-32">
        <Container>
          <SectionHeader
            title="Featured Gallery"
            subtitle="Curated showcases of architectural digital prototypes, aesthetic designs, and sport layouts."
          />
          <div className="grid gap-8 md:grid-cols-3">
            {/* Bento Card 1 - 2 cols */}
            <Card
              title="System Analytics & Digital Mockups"
              description="Dynamic hardware-accelerated layouts utilizing 3D data mapping and glass interfaces."
              imageSrc="/assets/gallery_2.png"
              imageAlt="Holographic data workspace"
              badge="Prototyping"
              aspectRatio="wide"
              className="md:col-span-2"
            />

            {/* Bento Card 2 - 1 col */}
            <Card
              title="Digital Aesthetics"
              description="Abstract geometrical systems constructed using custom layers and light accents."
              imageSrc="/assets/gallery_1.png"
              imageAlt="Abstract geometric art"
              badge="Artwork"
              aspectRatio="portrait"
              className="md:col-span-1"
            />

            {/* Bento Card 3 - 3 cols */}
            <Card
              title="High-Performance Motion Designs"
              description="Aesthetic athlete motion studies focusing on high-speed blur, layout lines, and premium sport visuals."
              imageSrc="/assets/gallery_3.png"
              imageAlt="Athlete sprinting on track at night"
              badge="Creative Direction"
              aspectRatio="wide"
              className="md:col-span-3"
            />
          </div>
        </Container>
      </section>

      {/* 5. Latest Videos Section */}
      <section
        id="videos"
        className="bg-canvas-muted border-border border-t border-b py-24 sm:py-32"
      >
        <Container>
          <SectionHeader
            title="Latest Videos"
            subtitle="Visual walk-throughs, designer panel discussions, and platform breakdowns."
            ctaText="Browse all videos"
            ctaHref="#videos"
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Video Card 1 */}
            <div className="border-border bg-canvas group hover:border-text-muted flex flex-col overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-neutral-900">
                <Image
                  src="/assets/gallery_2.png"
                  alt="Video thumbnail"
                  fill
                  loading="lazy"
                  className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="bg-canvas/90 border-border text-text flex h-14 w-14 items-center justify-center rounded-full border shadow-md backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <svg className="ml-1 h-6 w-6 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <span className="absolute right-4 bottom-4 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                  12:45
                </span>
              </div>
              <div className="p-6">
                <span className="text-brand text-xs font-semibold tracking-wider uppercase">
                  Guide
                </span>
                <h4 className="text-text mt-1 line-clamp-2 text-lg font-bold">
                  SK150 Platform Walkthrough
                </h4>
                <p className="text-text-muted mt-2 line-clamp-2 text-sm">
                  Take a complete visual tour of our file structures, design styles, and Edge
                  setups.
                </p>
              </div>
            </div>

            {/* Video Card 2 */}
            <div className="border-border bg-canvas group hover:border-text-muted flex flex-col overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-neutral-900">
                <Image
                  src="/assets/gallery_3.png"
                  alt="Video thumbnail"
                  fill
                  loading="lazy"
                  className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="bg-canvas/90 border-border text-text flex h-14 w-14 items-center justify-center rounded-full border shadow-md backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <svg className="ml-1 h-6 w-6 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <span className="absolute right-4 bottom-4 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                  18:20
                </span>
              </div>
              <div className="p-6">
                <span className="text-brand text-xs font-semibold tracking-wider uppercase">
                  Panel
                </span>
                <h4 className="text-text mt-1 line-clamp-2 text-lg font-bold">
                  Designing for Apple & Nike Aesthetics
                </h4>
                <p className="text-text-muted mt-2 line-clamp-2 text-sm">
                  Our design leads outline the principles of breathing whitespace, bold text, and
                  visual flow.
                </p>
              </div>
            </div>

            {/* Video Card 3 */}
            <div className="border-border bg-canvas group hover:border-text-muted flex flex-col overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-neutral-900">
                <Image
                  src="/assets/gallery_1.png"
                  alt="Video thumbnail"
                  fill
                  loading="lazy"
                  className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="bg-canvas/90 border-border text-text flex h-14 w-14 items-center justify-center rounded-full border shadow-md backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <svg className="ml-1 h-6 w-6 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <span className="absolute right-4 bottom-4 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                  14:10
                </span>
              </div>
              <div className="p-6">
                <span className="text-brand text-xs font-semibold tracking-wider uppercase">
                  Tutorial
                </span>
                <h4 className="text-text mt-1 line-clamp-2 text-lg font-bold">
                  Building Next-on-Pages Deployments
                </h4>
                <p className="text-text-muted mt-2 line-clamp-2 text-sm">
                  A step-by-step setup configuring Next.js 15 routing for Cloudflare&apos;s
                  serverless nodes.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Student Spotlight Section */}
      <section id="spotlight" className="py-24 sm:py-32">
        <Container>
          <SectionHeader
            title="Student Spotlight"
            subtitle="Highlighting the achievements and visual creations of our community builders."
          />
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Col - Portrait */}
            <div className="border-border relative aspect-[3/4] w-full overflow-hidden rounded-3xl border shadow-xl lg:col-span-5">
              <Image
                src="/assets/spotlight.png"
                alt="Student developer portrait"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                loading="lazy"
              />
            </div>

            {/* Right Col - Story */}
            <div className="flex flex-col justify-center lg:col-span-7">
              <span className="text-brand text-xs font-bold tracking-widest uppercase">
                Spotlight Profile
              </span>
              <h3 className="text-text mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Maya Henderson
              </h3>
              <p className="text-text-muted mt-1 text-sm font-semibold">
                Visual Designer & Frontend Engineer at SK150
              </p>

              <blockquote className="border-brand text-text mt-8 border-l-4 pl-6 font-serif text-xl leading-relaxed italic">
                &ldquo;Building at SK150 completely shifted my paradigm. Combining Apple&apos;s
                visual harmony with Nike&apos;s active, bold expression let me create interfaces
                that feel alive and responsive. The Edge runtime makes it lightning fast.&rdquo;
              </blockquote>

              <p className="text-text-muted mt-6 text-base leading-relaxed">
                Maya has constructed over 14 production-ready landing sections, utilizing Tailwind
                v4 variables to enforce contrast matching and custom scrollbars across macOS and
                mobile platforms.
              </p>

              <div className="mt-8">
                <Button variant="outline" size="md">
                  Read Full Spotlight Story
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. Timeline Preview Section */}
      <section
        id="timeline"
        className="bg-canvas-muted border-border border-t border-b py-24 sm:py-32"
      >
        <Container>
          <SectionHeader
            title="Timeline Preview"
            subtitle="Track our build path, system milestones, and future launch targets."
          />
          <div className="border-border relative ml-4 space-y-12 border-l pl-8 sm:ml-6 sm:pl-10 md:ml-8">
            {/* Timeline Item 1 */}
            <div className="relative">
              <div className="bg-brand text-canvas ring-canvas-muted absolute top-1.5 -left-[41px] flex h-6 w-6 items-center justify-center rounded-full ring-8 sm:-left-[49px]">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <span className="text-brand text-xs font-semibold tracking-wider uppercase">
                  Phase 1 &bull; Completed
                </span>
                <h4 className="text-text mt-1 text-xl font-bold">Foundation Setup</h4>
                <p className="text-text-muted mt-2 max-w-xl text-sm leading-relaxed">
                  Initialized Next.js 15, integrated ESLint v9 FlatCompat, set up Prettier
                  configurations with Tailwind v4 variables, and verified edge compilation
                  compatibility.
                </p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative">
              <div className="border-brand bg-canvas text-brand ring-canvas-muted absolute top-1.5 -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border-2 ring-8 sm:-left-[49px]">
                <span className="bg-brand h-2 w-2 animate-ping rounded-full" />
              </div>
              <div>
                <span className="text-brand text-xs font-semibold tracking-wider uppercase">
                  Phase 2 &bull; In Progress
                </span>
                <h4 className="text-text mt-1 text-xl font-bold">
                  Design System & Homepage Complete
                </h4>
                <p className="text-text-muted mt-2 max-w-xl text-sm leading-relaxed">
                  Constructing reusable layout UI components (Cards, Buttons, Headers) and
                  assembling 7 responsive visual sections inspired by Apple, Medium, and Nike
                  styles.
                </p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative">
              <div className="border-border bg-canvas text-text-muted ring-canvas-muted absolute top-1.5 -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border ring-8 sm:-left-[49px]">
                <div className="bg-border h-2 w-2 rounded-full" />
              </div>
              <div>
                <span className="text-text-muted text-xs font-semibold tracking-wider uppercase">
                  Phase 3 &bull; September 2026
                </span>
                <h4 className="text-text mt-1 text-xl font-bold">
                  Alpha Launch & Global Hackathon
                </h4>
                <p className="text-text-muted mt-2 max-w-xl text-sm leading-relaxed">
                  Enabling full interactive dashboard elements, hosting collaborative team sprints,
                  and launching the final platform to beta testers worldwide.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. Apple-Style Footer */}
      <footer className="bg-canvas text-text border-border border-t py-16">
        <Container clean>
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
            {/* Col 1 */}
            <div>
              <h5 className="text-text-muted text-xs font-bold tracking-wider uppercase">
                Platform
              </h5>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a href="#" className="text-text-muted hover:text-text transition-colors">
                    Overview
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text transition-colors">
                    Release Notes
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 2 */}
            <div>
              <h5 className="text-text-muted text-xs font-bold tracking-wider uppercase">
                Community
              </h5>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a href="#" className="text-text-muted hover:text-text transition-colors">
                    Discord Channel
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text transition-colors">
                    Student Work
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text transition-colors">
                    Hackathons
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text transition-colors">
                    Sponsorships
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h5 className="text-text-muted text-xs font-bold tracking-wider uppercase">
                Resources
              </h5>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a href="#" className="text-text-muted hover:text-text transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text transition-colors">
                    Brand Assets
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text transition-colors">
                    Academic Plan
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h5 className="text-text-muted text-xs font-bold tracking-wider uppercase">
                Legal & Company
              </h5>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a href="#" className="text-text-muted hover:text-text transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text transition-colors">
                    Security Rules
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-border mt-16 flex flex-col items-center justify-between gap-6 border-t pt-8 sm:flex-row">
            <div className="text-text-muted flex flex-col items-center gap-4 text-xs sm:flex-row">
              <span>&copy; {new Date().getFullYear()} SK150. All rights reserved.</span>
              <span className="hidden sm:inline">|</span>
              <a href="#" className="hover:text-text">
                Privacy Agreement
              </a>
              <span className="hidden sm:inline">&bull;</span>
              <a href="#" className="hover:text-text">
                Cookie Settings
              </a>
            </div>
            <div className="text-text-muted text-xs">
              Built globally &bull; Optimized at the edge
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}
