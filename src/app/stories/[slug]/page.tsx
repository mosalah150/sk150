import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Container from "@/components/ui/Container";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { articles } from "@/utils/blogData";

interface Props {
  params: Promise<{ slug: string }>;
}

// 1. Dynamic SEO & OpenGraph Metadata generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};

  const baseUrl = "https://sk150.pages.dev";
  const url = `${baseUrl}/stories/${article.slug}`;

  return {
    title: `${article.title} | SK150`,
    description: article.description,
    alternates: {
      canonical: `/stories/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      url,
      publishedTime: article.publishedTime,
      authors: [article.author.name],
      tags: article.tags,
      images: [
        {
          url: article.imageSrc,
          width: 800,
          height: 600,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [article.imageSrc],
    },
  };
}

// 2. Pre-compile all dynamic paths for static site rendering (SSG)
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Find up to 3 related articles, excluding the current article
  const relatedArticles = articles
    .filter(
      (a) =>
        a.id !== article.id &&
        (a.category === article.category || a.tags.some((t) => article.tags.includes(t))),
    )
    .slice(0, 3);

  // Default to any other articles if no related ones are found
  const finalRelated =
    relatedArticles.length > 0
      ? relatedArticles
      : articles.filter((a) => a.id !== article.id).slice(0, 3);

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
              </div>
            </div>
            <div className="text-text-muted flex items-center gap-4 text-xs font-medium">
              <span>{article.date}</span>
              <span className="bg-border h-1.5 w-1.5 rounded-full" />
              <span>{article.readTime}</span>
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

        {/* Medium-style Body Typography Grid */}
        <div className="mx-auto mt-16 max-w-[75ch]">
          <div className="text-text space-y-8 font-sans text-base leading-relaxed sm:text-lg">
            {article.content.map((paragraph, index) => {
              // Apply drop-cap styling to the first paragraph for classic editorial design
              if (index === 0) {
                return (
                  <p
                    key={index}
                    className="first-letter:text-brand text-lg leading-relaxed first-letter:float-left first-letter:mr-2.5 first-letter:text-5xl first-letter:font-black"
                  >
                    {paragraph}
                  </p>
                );
              }

              // Inject a graphic pullquote in the middle of content blocks
              if (index === 2) {
                return (
                  <React.Fragment key={index}>
                    <blockquote className="border-brand text-text my-10 border-l-4 pl-6 font-serif text-xl leading-relaxed italic sm:text-2xl">
                      &ldquo;มิตรภาพที่เกิดขึ้นในรั้วโรงเรียนไม่ใช่แค่ช่วงเวลาสั้นๆ
                      แต่มันคือสายใยความทรงจำที่พวกเราจะช่วยกันดูแลและเก็บรักษาไว้ตลอดไป&rdquo;
                    </blockquote>
                    <p>{paragraph}</p>
                  </React.Fragment>
                );
              }

              return <p key={index}>{paragraph}</p>;
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
            title="เรื่องราวอื่นๆ ที่เกี่ยวข้อง"
            subtitle="บันทึกความทรงจำและกิจกรรมอื่นๆ ที่น่าสนใจเพิ่มเติมในหัวข้อนี้"
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
                readTime={related.readTime}
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
