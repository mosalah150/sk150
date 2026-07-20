"use client";

import React from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { useDynamicData } from "@/providers/DynamicDataProvider";
import { Article } from "@/types/blog";

export default function ArticleDetailClient({
  staticArticle,
  slug,
}: {
  staticArticle: Article;
  slug: string;
}) {
  const { posts } = useDynamicData();

  // Find dynamic version of the article or fallback to static build prop
  const article = posts.find((a) => a.slug === slug) || staticArticle;

  // Find related articles
  const relatedArticles = posts
    .filter(
      (a) =>
        a.id !== article.id &&
        (a.category === article.category || a.tags.some((t) => article.tags.includes(t))),
    )
    .slice(0, 3);

  const finalRelated =
    relatedArticles.length > 0
      ? relatedArticles
      : posts.filter((a) => a.id !== article.id).slice(0, 3);

  const breadcrumbItems = [
    { label: "หน้าแรก", href: "/" },
    { label: "ความทรงจำ", href: "/stories" },
    { label: article.title },
  ];

  return (
    <article
      id="content"
      tabIndex={-1}
      className="bg-canvas text-text flex-1 transition-colors duration-200 outline-none"
    >
      {/* Header Container & Breadcrumbs */}
      <div className="border-border bg-canvas-muted border-b">
        <Container className="py-6">
          <Breadcrumb items={breadcrumbItems} />
        </Container>
      </div>

      {/* Main Reading Flow */}
      <Container className="py-16 sm:py-24">
        {/* Editorial Heading Panel */}
        <div className="mx-auto max-w-[75ch] text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <span className="bg-brand/10 border-brand/20 text-brand rounded-full border px-3.5 py-1 text-xs font-bold tracking-wider uppercase">
              {article.category}
            </span>
          </div>

          <h1 className="text-text mt-6 font-sans text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            {article.title}
          </h1>

          <p className="text-text-muted mt-6 text-lg leading-relaxed font-normal sm:text-xl">
            {article.description}
          </p>

          {/* Author Bio Card */}
          <div className="border-border mt-10 flex flex-col items-center justify-between gap-6 border-t pt-8 sm:flex-row">
            <div className="flex items-center gap-4 text-left">
              <div className="border-border relative h-12 w-12 overflow-hidden rounded-full border">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="text-text text-sm font-bold">{article.author.name}</h3>
                <p className="text-text-muted text-xs font-medium">{article.author.title}</p>
                <div className="text-text-muted flex items-center gap-4 text-xs font-medium mt-1">
                  <span>{article.date}</span>
                  <span className="bg-border h-1.5 w-1.5 rounded-full" />
                  <span>เขียนโดย {article.author.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cover Image */}
        <div className="border-border relative mt-12 aspect-video w-full overflow-hidden rounded-3xl border shadow-lg">
          <Image
            src={article.imageSrc}
            alt={article.title}
            fill
            priority
            fetchPriority="high"
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Body Typography */}
        <div className="mx-auto mt-16 max-w-[75ch]">
          <div className="text-text space-y-8 font-sans text-base leading-relaxed sm:text-lg">
            {article.content.map((paragraph, index) => {
              const trimmed = paragraph.trim();

              // 1. Heading 2
              if (trimmed.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-text mt-12 text-2xl font-bold tracking-tight sm:text-3xl">
                    {trimmed.replace(/^##\s+/, "")}
                  </h2>
                );
              }

              // 2. Heading 3
              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={index} className="text-text mt-8 text-xl font-bold tracking-tight sm:text-2xl">
                    {trimmed.replace(/^###\s+/, "")}
                  </h3>
                );
              }

              // 3. Blockquote
              if (trimmed.startsWith("> ")) {
                return (
                  <blockquote key={index} className="border-brand text-text my-8 border-l-4 pl-6 font-serif text-lg leading-relaxed italic sm:text-xl">
                    {trimmed.replace(/^>\s+/, "")}
                  </blockquote>
                );
              }

              // 4. Image Markdown
              const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
              if (imgMatch) {
                return (
                  <div key={index} className="border-border relative my-10 overflow-hidden rounded-3xl border shadow-md">
                    <img
                      src={imgMatch[2]}
                      alt={imgMatch[1] || "Image"}
                      className="w-full object-cover max-h-[480px]"
                    />
                    {imgMatch[1] && (
                      <div className="bg-canvas-muted text-text-muted border-t border-border px-6 py-3 text-center text-xs font-medium">
                        {imgMatch[1]}
                      </div>
                    )}
                  </div>
                );
              }

              // 5. Default paragraph with inline styling (bold, italic, links)
              let html = trimmed;
              html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
              html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
              html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-brand hover:underline font-semibold">$1</a>');

              if (index === 0) {
                return (
                  <p
                    key={index}
                    className="first-letter:text-brand text-lg leading-relaxed first-letter:float-left first-letter:mr-2.5 first-letter:text-5xl first-letter:font-black"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              }

              return (
                <p
                  key={index}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              );
            })}
          </div>

          {/* Tags List */}
          <div className="border-border mt-16 flex flex-wrap gap-2 border-t pt-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="bg-canvas-muted border-border text-text-muted hover:border-text rounded-full border px-3.5 py-1 text-xs font-semibold transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Container>

      {/* 3. Related Articles Section */}
      <section className="bg-canvas-muted border-border border-t py-24">
        <Container>
          <SectionHeader
            title="เรื่องราวอื่นๆ ที่น่าสนใจ"
            subtitle="ย้อนอ่านบันทึกกิจกรรมความทรงจำและมิตรภาพของพวกเราต่อได้ที่นี่"
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {finalRelated.map((related) => (
              <Card
                key={related.id}
                title={related.title}
                description={related.description}
                imageSrc={related.imageSrc}
                imageAlt={related.title}
                badge={related.category}
                date={related.date}
                authorName={related.author.name}
                href={`/stories/${related.slug}`}
                aspectRatio="video"
              />
            ))}
          </div>
        </Container>
      </section>
    </article>
  );
}
