"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import { studentProfiles } from "@/utils/spotlightData";
import { useDynamicData } from "@/providers/DynamicDataProvider";

export default function SpotlightPage() {
  const { students } = useDynamicData();
  const [activeStudentId, setActiveStudentId] = useState(students[0]?.id || "");

  useEffect(() => {
    if (students.length > 0 && !activeStudentId) {
      setActiveStudentId(students[0].id);
    }
  }, [students, activeStudentId]);

  const activeStudent =
    students.find((s) => s.id === activeStudentId) || students[0] || studentProfiles[0];

  return (
    <div className="bg-canvas text-text flex-1 pb-24 transition-colors duration-200">
      {/* 1. Page Header */}
      <section className="bg-canvas-muted border-border border-b py-16 sm:py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <span className="text-brand text-xs font-bold tracking-widest uppercase">
              ทำเนียบศิษย์เก่า
            </span>
            <h1 className="text-text mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              สุภาพบุรุษนักเรียนเด่นประจำรุ่น
            </h1>
            <p className="text-text-muted mt-4 text-lg leading-relaxed">
              อ่านบันทึกประวัติและบทสัมภาษณ์เจาะลึกเพื่อนนักเรียนโรงเรียนสวนกุหลาบวิทยาลัย รุ่น 150 ผู้นำแห่งอนาคต (Future Leaders)
            </p>
          </div>

          {/* Student Profile Selector Bar */}
          <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-4">
            {students.map((student) => (
              <button
                key={student.id}
                onClick={() => setActiveStudentId(student.id)}
                className={`focus-visible:outline-brand cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 ${
                  activeStudentId === student.id
                    ? "bg-text text-canvas"
                    : "bg-canvas text-text-muted border-border hover:bg-canvas-muted hover:text-text hover:border-text-muted border"
                }`}
              >
                {student.name}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* 2. Featured Student Profile Spread */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid items-start gap-12 sm:gap-16 lg:grid-cols-12">
            {/* Left Column: Photo Frame and Social handles */}
            <div className="flex flex-col items-center lg:col-span-5">
              <div className="border-border bg-canvas-muted group relative aspect-square w-full max-w-[360px] overflow-hidden rounded-[32px] border shadow-md lg:max-w-full">
                <Image
                  src={activeStudent.imageSrc}
                  alt={activeStudent.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 80vw, 35vw"
                />
              </div>

              {/* Social Channels Badge Cluster */}
              <div className="mt-8 flex items-center justify-center gap-4">
                {/* Instagram Button */}
                <a
                  href={activeStudent.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-canvas border-border text-text-muted focus-visible:outline-brand rounded-full border p-3 transition-all hover:scale-105 hover:border-[#E1306C] hover:text-[#E1306C] focus-visible:outline focus-visible:outline-2 active:scale-95"
                  aria-label="Instagram Profile"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>

                {/* TikTok Button */}
                <a
                  href={activeStudent.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-canvas border-border text-text-muted focus-visible:outline-brand rounded-full border p-3 transition-all hover:scale-105 hover:border-[#00f2fe] hover:text-[#fe0979] focus-visible:outline focus-visible:outline-2 active:scale-95"
                  aria-label="TikTok Profile"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.03 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.53-4.09-1.37-.76-.53-1.39-1.27-1.88-2.07v7.41c.01 1.43-.37 2.85-1.13 4.08-1.5 2.45-4.4 3.75-7.25 3.19-2.62-.5-4.83-2.52-5.46-5.11-.79-3.23.95-6.73 4.09-7.79 1.09-.37 2.27-.42 3.4-.15v4.1c-.88-.26-1.85-.2-2.67.28-1.07.62-1.63 1.94-1.38 3.16.27 1.34 1.6 2.31 2.96 2.19 1.4-.04 2.57-1.24 2.57-2.64V0h.03z" />
                  </svg>
                </a>

                {/* YouTube Button */}
                <a
                  href={activeStudent.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-canvas border-border text-text-muted focus-visible:outline-brand rounded-full border p-3 transition-all hover:scale-105 hover:border-[#FF0000] hover:text-[#FF0000] focus-visible:outline focus-visible:outline-2 active:scale-95"
                  aria-label="YouTube Channel"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Column: Title info, key metrics, and Biography prose */}
            <div className="text-left lg:col-span-7">
              <div>
                <span className="bg-brand/10 border-brand/20 text-brand inline-block rounded-full border px-3.5 py-1 text-xs font-bold tracking-wider uppercase">
                  {activeStudent.achievement}
                </span>

                <h2 className="text-text mt-6 text-4xl leading-none font-extrabold tracking-tight sm:text-5xl">
                  {activeStudent.name}
                </h2>
                <h4 className="text-text-muted mt-2 text-lg font-bold">{activeStudent.title}</h4>
              </div>

              {/* Spotlight Performance Metrics Grid */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                {activeStudent.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="bg-canvas-muted border-border rounded-2xl border p-4 text-center shadow-sm sm:p-5"
                  >
                    <span className="text-text block text-xl font-black sm:text-2xl">
                      {metric.value}
                    </span>
                    <span className="text-text-muted mt-1 block text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Medium-style biography prose column */}
              <div className="text-text mt-12 max-w-[70ch] space-y-6 font-sans text-base leading-relaxed sm:text-lg">
                {activeStudent.bioParagraphs.map((para, idx) => {
                  // Set drop cap on first paragraph
                  if (idx === 0) {
                    return (
                      <p
                        key={idx}
                        className="first-letter:text-brand text-lg first-letter:float-left first-letter:mr-2.5 first-letter:text-5xl first-letter:font-black"
                      >
                        {para}
                      </p>
                    );
                  }

                  // Inject stylized quote block mid-way
                  if (idx === 1) {
                    return (
                      <React.Fragment key={idx}>
                        <blockquote className="border-brand text-text my-10 border-l-4 pl-6 font-serif text-xl leading-relaxed italic">
                          &ldquo;{activeStudent.highlightQuote}&rdquo;
                        </blockquote>
                        <p>{para}</p>
                      </React.Fragment>
                    );
                  }

                  return <p key={idx}>{para}</p>;
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
