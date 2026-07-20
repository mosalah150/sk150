import React from "react";
import Image from "next/image";
import Link from "next/link";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  badge?: string;
  date?: string;
  readTime?: string;
  authorName?: string;
  href?: string;
  glass?: boolean;
  hoverEffect?: boolean;
  aspectRatio?: "video" | "square" | "portrait" | "wide";
  children?: React.ReactNode;
}

export default function Card({
  title,
  description,
  imageSrc,
  imageAlt = "Card image",
  badge,
  date,
  readTime,
  authorName,
  href,
  glass = false,
  hoverEffect = true,
  aspectRatio = "video",
  className = "",
  children,
  ...props
}: CardProps) {
  const containerStyle = `
    relative flex flex-col overflow-hidden rounded-3xl border border-border transition-all duration-300
    ${glass ? "bg-canvas/50 backdrop-blur-md" : "bg-canvas-muted"}
    ${hoverEffect ? "hover:-translate-y-1 hover:border-text-muted hover:shadow-lg" : ""}
    ${className}
  `;

  const aspectStyles = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    wide: "aspect-[21/9]",
  };

  const Content = () => (
    <>
      {/* Cover Image */}
      {imageSrc && (
        <div className={`relative w-full overflow-hidden ${aspectStyles[aspectRatio]}`}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
          {badge && (
            <div className="bg-canvas/85 text-text border-border absolute top-4 left-4 z-10 rounded-full border px-3.5 py-1 text-xs font-semibold tracking-tight backdrop-blur-sm">
              {badge}
            </div>
          )}
        </div>
      )}

      {/* Body Details */}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        {/* Metadata */}
        {(date || readTime || authorName) && (
          <div className="text-text-muted mb-3 flex items-center gap-3 text-xs font-medium tracking-tight">
            {date && <span>{date}</span>}
            {date && (readTime || authorName) && <span className="bg-border h-1 w-1 rounded-full" />}
            {authorName && <span>โดย {authorName}</span>}
            {!authorName && readTime && <span>{readTime}</span>}
          </div>
        )}

        {/* Title */}
        <h3 className="text-text hover:text-brand line-clamp-2 text-xl font-bold tracking-tight transition-colors duration-150">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-text-muted mt-3 line-clamp-3 text-sm leading-relaxed">{description}</p>
        )}

        {/* Extra nested slot */}
        {children && <div className="mt-6 flex flex-1 flex-col justify-end">{children}</div>}
      </div>
    </>
  );

  return (
    <div className={containerStyle} {...props}>
      {href && <Link href={href} className="absolute inset-0 z-20" aria-label={title} />}
      <Content />
    </div>
  );
}
