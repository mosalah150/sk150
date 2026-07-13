import React from "react";
import Link from "next/link";

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  centered?: boolean;
}

export default function SectionHeader({
  title,
  subtitle,
  ctaText,
  ctaHref,
  centered = false,
  className = "",
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={`mb-12 flex flex-col justify-between gap-6 sm:mb-16 md:flex-row md:items-end ${
        centered ? "items-center text-center md:items-center" : "items-start"
      } ${className}`}
      {...props}
    >
      <div className={`max-w-2xl ${centered ? "mx-auto" : ""}`}>
        <h2 className="text-text text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {subtitle && (
          <p className="text-text-muted mt-4 text-base leading-relaxed sm:text-lg">{subtitle}</p>
        )}
      </div>

      {ctaText && ctaHref && (
        <div className="flex-shrink-0">
          <Link
            href={ctaHref}
            className="text-brand group inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-80"
          >
            {ctaText}
            <svg
              className="h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
