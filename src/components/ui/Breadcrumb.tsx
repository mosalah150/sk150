import React from "react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items, className = "", ...props }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`py-4 text-sm ${className}`} {...props}>
      <ol className="text-text-muted flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center gap-2">
              {index > 0 && (
                <svg
                  className="text-border h-3 w-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}

              {isLast ? (
                <span aria-current="page" className="text-text font-semibold select-none">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-text font-medium transition-colors duration-150"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
