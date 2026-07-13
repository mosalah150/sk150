"use client";

import React, { useState } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
// Mock Committee Members
const committeeMembers = [
  {
    name: "Alex Thorne",
    role: "Core Infrastructure Lead",
    bio: "Core platform architect specializing in Next.js Edge compile pipelines and Cloudflare V8 worker emulations.",
    image: "/assets/spotlight.png",
  },
  {
    name: "Maya Henderson",
    role: "Lead Visual Architect",
    bio: "Visual system designer responsible for standardizing oklch CSS color tokens and responsive glassmorphic cards.",
    image: "/assets/spotlight.png",
  },
  {
    name: "Marcus Vance",
    role: "Systems Operations Lead",
    bio: "Infrastructure manager coordinating automated sandbox verification scripts and continuous Edge deployments.",
    image: "/assets/spotlight.png",
  },
];

// Mock FAQs
const faqs = [
  {
    question: "What is the core design philosophy of SK150?",
    answer:
      "SK150 is modeled around Apple's clean layouts, Medium's readable editorial typography columns, and Nike's energetic, high-speed motion design. We prioritize whitespace, card layouts, translucent glassmorphism overlays, and outline styles.",
  },
  {
    question: "Why does the platform compile directly to Cloudflare Pages?",
    answer:
      "Cloudflare Pages compiles routing paths directly as lightweight V8 isolates rather than heavy node containers. This reduces cold start delays and serves visual layouts from edge nodes closest to the client in under 10 milliseconds.",
  },
  {
    question: "How are design variables and color schemes managed?",
    answer:
      "All colors are configured inside globals.css using oklch color scales. Dynamic dark themes are evaluated instantly client-side using light-dark() CSS rules, avoiding layout flashes (FOUC).",
  },
  {
    question: "How does the global spotlight search work?",
    answer:
      "Spotlight search runs entirely client-side, matching keywords across articles, galleries, events, and student profiles in less than 2 milliseconds. It can be triggered instantly using keyboard shortcuts like ⌘K or /.",
  },
];

export default function AboutPage() {
  // FAQ accordion state: maps index -> open boolean
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Contact Form States
  const [formInputs, setFormInputs] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Turnstile Mock Captcha States
  const [isTurnstileVerified, setIsTurnstileVerified] = useState(false);
  const [isVerifyingTurnstile, setIsVerifyingTurnstile] = useState(false);

  const handleTurnstileVerify = () => {
    if (isTurnstileVerified || isVerifyingTurnstile) return;
    setIsVerifyingTurnstile(true);
    setTimeout(() => {
      setIsVerifyingTurnstile(false);
      setIsTurnstileVerified(true);
    }, 850);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInputs.name || !formInputs.email || !formInputs.message) {
      alert("Please fill in all form fields.");
      return;
    }

    if (!isTurnstileVerified) {
      alert("Please complete the security Turnstile verification.");
      return;
    }

    setIsSubmitting(true);

    // Simulate database write lag (1000ms)
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Message successfully submitted! Thank you, ${formInputs.name}.`);
      setFormInputs({ name: "", email: "", message: "" });
      setIsTurnstileVerified(false);
    }, 1000);
  };

  return (
    <div className="bg-canvas text-text flex-1 pb-24 transition-colors duration-200 select-none">
      {/* 1. Page Header */}
      <section className="bg-canvas-muted border-border border-b py-16 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <span className="text-brand text-xs font-bold tracking-widest uppercase">
              Organization
            </span>
            <h1 className="text-text mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              About SK150
            </h1>
            <p className="text-text-muted mt-4 text-lg leading-relaxed">
              Discover our visual principles, historical developments, active committee board, and
              developer resources.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. Vision & Mission Magazine Spread */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid items-start gap-12 sm:gap-16 md:grid-cols-2">
            {/* Vision Panel */}
            <div className="border-border bg-canvas hover:border-text-muted rounded-3xl border p-8 transition-all duration-300 sm:p-10">
              <span className="text-brand text-xs font-bold tracking-widest uppercase">
                The Dream
              </span>
              <h2 className="text-text mt-3 text-3xl font-black tracking-tight">Our Vision</h2>
              <p className="text-text-muted mt-5 text-sm leading-relaxed sm:text-base">
                We believe that modern web applications should paint instantly, look premium, and be
                accessible to all users. Our visual goal is to bridge high-end Apple-style design
                aesthetics with Nike-style high-speed motion, proving that performance and beauty
                can coexist in edge runtimes.
              </p>
            </div>

            {/* Mission Panel */}
            <div className="border-border bg-canvas hover:border-text-muted rounded-3xl border p-8 transition-all duration-300 sm:p-10">
              <span className="text-brand text-xs font-bold tracking-widest uppercase">
                The Action
              </span>
              <h2 className="text-text mt-3 text-3xl font-black tracking-tight">Our Mission</h2>
              <p className="text-text-muted mt-5 text-sm leading-relaxed sm:text-base">
                Our mission is to standardize visual layouts inside lightweight Cloudflare workers.
                By minimizing input latency, enforcing strict local sandbox audits, and building
                accessible component pipelines, we empower student teams to ship production-ready
                edge pages in under 4 seconds.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. History Timeline Roadmaps */}
      <section className="bg-canvas-muted border-border border-y py-20">
        <Container>
          <SectionHeader
            title="Our History & Progress"
            subtitle="Explore our key developmental milestones over the last decade."
          />

          <div className="border-border relative mx-auto ml-4 max-w-4xl space-y-12 border-l pl-10 sm:ml-8 sm:pl-12 md:ml-12">
            {/* milestone 01 */}
            <div className="relative">
              <div className="bg-canvas ring-canvas-muted absolute top-1.5 -left-[51px] flex h-6 w-6 items-center justify-center rounded-full ring-8 sm:-left-[59px]">
                <span className="bg-brand h-3.5 w-3.5 rounded-full" />
              </div>
              <div>
                <span className="text-brand text-xs font-bold tracking-wider uppercase">
                  2026 &bull; Platform Migration
                </span>
                <h3 className="mt-1 text-xl font-bold tracking-tight">
                  Next.js 15 App Router & Tailwind v4
                </h3>
                <p className="text-text-muted mt-2 text-xs leading-relaxed sm:text-sm">
                  Migrated all components to Next.js 15 Server layouts, caching static assets
                  directly on Cloudflare worker nodes worldwide for sub-10ms TTFB.
                </p>
              </div>
            </div>

            {/* milestone 02 */}
            <div className="relative">
              <div className="bg-canvas ring-canvas-muted absolute top-1.5 -left-[51px] flex h-6 w-6 items-center justify-center rounded-full ring-8 sm:-left-[59px]">
                <span className="bg-border h-3.5 w-3.5 rounded-full" />
              </div>
              <div>
                <span className="text-text-muted text-xs font-bold tracking-wider uppercase">
                  2023 &bull; Design Overhaul
                </span>
                <h3 className="mt-1 text-xl font-bold tracking-tight">Unified Token Integration</h3>
                <p className="text-text-muted mt-2 text-xs leading-relaxed sm:text-sm">
                  Standardized on oklch variables and backdrop-filters to build high-end dark modes
                  and glassmorphic card primitives.
                </p>
              </div>
            </div>

            {/* milestone 03 */}
            <div className="relative">
              <div className="bg-canvas ring-canvas-muted absolute top-1.5 -left-[51px] flex h-6 w-6 items-center justify-center rounded-full ring-8 sm:-left-[59px]">
                <span className="bg-border h-3.5 w-3.5 rounded-full" />
              </div>
              <div>
                <span className="text-text-muted text-xs font-bold tracking-wider uppercase">
                  2016 &bull; Foundation Kickoff
                </span>
                <h3 className="mt-1 text-xl font-bold tracking-tight">Base Platform Release</h3>
                <p className="text-text-muted mt-2 text-xs leading-relaxed sm:text-sm">
                  Initialized the first student dashboard to test web compilation targets and share
                  resources locally.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Committee Board Grid */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeader
            title="The Committee Board"
            subtitle="Meet the core student leaders behind the design and infrastructure."
          />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {committeeMembers.map((member, index) => (
              <div
                key={index}
                className="bg-canvas border-border hover:border-text-muted flex flex-col items-center rounded-3xl border p-6 text-center transition-all duration-300 hover:shadow-md sm:p-8"
              >
                <div className="border-border bg-canvas-muted relative h-24 w-24 overflow-hidden rounded-full border">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-text mt-4 text-lg font-bold">{member.name}</h3>
                <span className="text-brand mt-1 text-xs font-bold tracking-wider uppercase">
                  {member.role}
                </span>
                <p className="text-text-muted mt-4 text-xs leading-relaxed sm:text-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. FAQs Accordion list */}
      <section className="bg-canvas-muted border-border border-y py-20">
        <Container>
          <SectionHeader
            title="Frequently Asked Questions"
            subtitle="Answers to common technical and design queries regarding SK150."
          />

          <div className="mx-auto max-w-3xl space-y-4 text-left">
            {faqs.map((faq, index) => {
              const isOpen = index === openFaqIndex;

              return (
                <div
                  key={index}
                  className="bg-canvas border-border overflow-hidden rounded-2xl border transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left text-sm font-bold focus-visible:outline-none sm:text-base"
                  >
                    <span>{faq.question}</span>
                    <svg
                      className={`text-text-muted h-4.5 w-4.5 transform transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="border-border animate-in fade-in slide-in-from-top-1 border-t px-6 pt-2 pb-6 duration-150">
                      <p className="text-text-muted text-xs leading-relaxed sm:text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 6. Contact Panel Grid */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid items-start gap-12 sm:gap-16 lg:grid-cols-12">
            {/* Left Column: Office Contacts */}
            <div className="text-left lg:col-span-5">
              <span className="text-brand text-xs font-bold tracking-widest uppercase">
                Handshake
              </span>
              <h2 className="text-text mt-3 text-3xl font-black tracking-tight">Get in Touch</h2>
              <p className="text-text-muted mt-4 text-sm leading-relaxed sm:text-base">
                Have questions about design systems variables or serverless Pages integrations? Send
                us a direct message.
              </p>

              <div className="text-text-muted mt-8 space-y-6 text-sm font-semibold">
                <div className="flex items-center gap-3">
                  <svg
                    className="text-brand h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>contact@sk150.pages.dev</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="text-brand h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  <span>Systems Laboratory, Block B</span>
                </div>
              </div>
            </div>

            {/* Right Column: Input Message Form */}
            <div className="bg-canvas-muted border-border rounded-3xl border p-6 sm:p-8 lg:col-span-7">
              <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
                <div>
                  <label
                    htmlFor="name"
                    className="text-text-muted mb-2 block text-xs font-bold tracking-wider uppercase"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formInputs.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="bg-canvas border-border text-text placeholder-text-muted focus:border-brand w-full rounded-xl border px-4 py-3 text-sm focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-text-muted mb-2 block text-xs font-bold tracking-wider uppercase"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formInputs.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="bg-canvas border-border text-text placeholder-text-muted focus:border-brand w-full rounded-xl border px-4 py-3 text-sm focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="text-text-muted mb-2 block text-xs font-bold tracking-wider uppercase"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formInputs.message}
                    onChange={handleInputChange}
                    placeholder="Describe your design or performance query"
                    className="bg-canvas border-border text-text placeholder-text-muted focus:border-brand w-full resize-none rounded-xl border px-4 py-3 text-sm focus:outline-none"
                    required
                  />
                </div>

                {/* Cloudflare Turnstile Mock Widget (Sprint 13 Protection) */}
                <div className="border-border bg-canvas flex max-w-sm items-center justify-between rounded-2xl border p-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleTurnstileVerify}
                      disabled={isTurnstileVerified || isVerifyingTurnstile}
                      className={`flex h-6 w-6 items-center justify-center rounded border transition-all ${
                        isTurnstileVerified
                          ? "bg-brand/10 border-brand text-brand"
                          : "border-border hover:border-text-muted cursor-pointer"
                      }`}
                    >
                      {isVerifyingTurnstile && (
                        <div className="border-brand h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-transparent" />
                      )}
                      {isTurnstileVerified && (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className="text-text-muted text-xs font-semibold select-none">
                      {isTurnstileVerified
                        ? "Verification Successful"
                        : isVerifyingTurnstile
                          ? "Verifying..."
                          : "Verify that you are human"}
                    </span>
                  </div>
                  <div className="pointer-events-none flex flex-col items-end opacity-80 select-none">
                    <div className="flex items-center gap-1.5">
                      <svg
                        className="text-brand h-4.5 w-4.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <span className="text-text font-sans text-[10px] font-black tracking-wide">
                        Turnstile
                      </span>
                    </div>
                    <span className="text-text-muted mt-0.5 text-[7px] font-bold tracking-widest uppercase">
                      Privacy • Terms
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isTurnstileVerified}
                    className={`focus-visible:outline-brand cursor-pointer rounded-full border px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-all focus-visible:outline focus-visible:outline-2 ${
                      isSubmitting || !isTurnstileVerified
                        ? "bg-canvas-muted text-text-muted border-border cursor-not-allowed"
                        : "bg-text text-canvas hover:bg-canvas hover:text-text hover:border-text border-transparent"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="border-text-muted h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-transparent" />
                        Sending...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
