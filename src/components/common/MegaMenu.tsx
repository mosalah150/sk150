import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface MegaMenuItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

interface MegaMenuProps {
  isOpen: boolean;
  menuType: "platform" | "resources" | null;
  onClose: () => void;
}

export default function MegaMenu({ isOpen, menuType, onClose }: MegaMenuProps) {
  if (!isOpen || !menuType) return null;

  const platformItems: MegaMenuItem[] = [
    {
      title: "About Overview",
      description: "Explore the Next.js 15, Tailwind v4, and Cloudflare Pages foundation details.",
      href: "/about",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      title: "Design System Elements",
      description:
        "Visual guidelines built with modern oklch variables and custom light-dark() utilities.",
      href: "#design",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Developer Hub & Tools",
      description: "Admin panel dashboard with D1 SQL consoles and R2 file upload progress logs.",
      href: "/admin",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      ),
    },
  ];

  const resourceItems: MegaMenuItem[] = [
    {
      title: "Documentation API",
      description:
        "Complete technical manuals covering routing adapters and local verification steps.",
      href: "#docs",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      title: "Guides & Tutorials",
      description: "Step-by-step videos and walkthroughs covering bento layouts and accessibility.",
      href: "#tutorials",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Community Discord",
      description: "Join active designer panels, student spotlight entries, and group hackathons.",
      href: "#community",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
          />
        </svg>
      ),
    },
    {
      title: "Downloads Center",
      description: "Retrieve vector logos, brand assets, wallpapers, and spec PDFs.",
      href: "/downloads",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      ),
    },
  ];

  const currentItems = menuType === "platform" ? platformItems : resourceItems;
  const menuTitle = menuType === "platform" ? "SK150 Platform Overview" : "Developer Resources Hub";

  return (
    <div
      className="border-border bg-canvas/98 animate-in fade-in slide-in-from-top-2 absolute top-full right-0 left-0 z-40 border-b shadow-xl backdrop-blur-lg duration-200"
      onMouseLeave={onClose}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 sm:px-12 lg:grid-cols-12 lg:px-20">
        {/* Main Links Grid */}
        <div className="lg:col-span-8">
          <span className="text-brand text-xs font-bold tracking-wider uppercase">{menuTitle}</span>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            {currentItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="group hover:bg-canvas-muted hover:border-border flex gap-4 rounded-2xl border border-transparent p-4 transition-colors duration-150"
                onClick={onClose}
              >
                <div className="bg-brand/10 text-brand flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-text group-hover:text-brand text-sm font-bold transition-colors sm:text-base">
                    {item.title}
                  </h4>
                  <p className="text-text-muted mt-1 text-xs leading-relaxed sm:text-sm">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Feature Highlight Panel (Nike / Apple aesthetic card) */}
        <div className="border-border bg-canvas-muted group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-6 lg:col-span-4">
          <div>
            <span className="text-brand text-xs font-bold tracking-widest uppercase">
              Featured Event
            </span>
            <h4 className="text-text mt-3 text-xl font-bold tracking-tight">SK150 Hackathon</h4>
            <p className="text-text-muted mt-2 text-xs leading-relaxed sm:text-sm">
              Register now for the virtual design hackathon on July 24. Build dynamic edge
              interfaces in 48 hours.
            </p>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <span className="text-text-muted text-xs font-medium">
              Virtual &bull; Open Registration
            </span>
            <Button variant="primary" size="sm" className="relative z-10">
              Register
            </Button>
          </div>
          {/* Subtle background glow */}
          <div className="bg-brand/10 group-hover:bg-brand/20 pointer-events-none absolute -right-16 -bottom-16 h-32 w-32 rounded-full blur-3xl transition-all duration-300" />
        </div>
      </div>
    </div>
  );
}
