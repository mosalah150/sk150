import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { articles } from "@/utils/blogData";
import ArticleDetailClient from "@/components/common/ArticleDetailClient";

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

  return <ArticleDetailClient staticArticle={article} slug={slug} />;
}
