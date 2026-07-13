"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { articles } from "@/utils/blogData";

type CategoryFilter = "All" | "Design" | "Performance" | "DevOps" | "Sports";

export default function StoriesPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");

  // The first article is designated as the Featured Story
  const featuredArticle = articles[0];

  // Filter articles based on active category selection (excluding the featured one if category is "All")
  const filteredArticles = articles.filter((article) => {
    const matchesCategory = activeCategory === "All" || article.category === activeCategory;
    return matchesCategory;
  });

  const categories: CategoryFilter[] = ["All", "Design", "Performance", "DevOps", "Sports"];

  return (
    <div className="bg-canvas text-text flex-1 transition-colors duration-200">
      {/* 1. Header & Featured Hero Block */}
      <section className="bg-canvas-muted border-border border-b py-16 sm:py-20">
        <Container>
          <div className="mb-12 max-w-3xl">
            <span className="text-brand text-xs font-bold tracking-widest uppercase">Magazine</span>
            <h1 className="text-text mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Stories & Perspectives
            </h1>
            <p className="text-text-muted mt-4 text-lg leading-relaxed">
              Read insights, detailed tutorials, and design principles compiled by our core
              infrastructure and visual architecture teams.
            </p>
          </div>

          {/* Featured Card (Apple/Medium layout style) */}
          <div className="border-border bg-canvas hover:border-text-muted group relative overflow-hidden rounded-3xl border shadow-xl transition-all duration-300">
            {/* Absolute overlay link covering the card */}
            <Link
              href={`/stories/${featuredArticle.slug}`}
              className="absolute inset-0 z-20"
              aria-label={`Read Featured Story: ${featuredArticle.title}`}
            />
            <div className="grid lg:grid-cols-12">
              {/* Image Banner */}
              <div className="relative aspect-video min-h-[320px] w-full overflow-hidden lg:col-span-7 lg:aspect-auto">
                <Image
                  src={featuredArticle.imageSrc}
                  alt={featuredArticle.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-102"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <span className="bg-brand text-canvas absolute top-6 left-6 z-10 rounded-full px-3.5 py-1 text-xs font-bold tracking-wider uppercase shadow-md">
                  Featured Story
                </span>
              </div>

              {/* Story Details */}
              <div className="flex flex-col justify-between p-8 sm:p-10 lg:col-span-5">
                <div>
                  <span className="text-brand text-xs font-bold tracking-wider uppercase">
                    {featuredArticle.category}
                  </span>
                  <h2 className="text-text group-hover:text-brand mt-3 text-2xl font-black tracking-tight transition-colors sm:text-3xl">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-text-muted mt-4 text-sm leading-relaxed">
                    {featuredArticle.description}
                  </p>
                </div>

                <div className="border-border mt-8 flex items-center justify-between border-t pt-6">
                  <div className="flex items-center gap-3">
                    <div className="border-border relative h-10 w-10 overflow-hidden rounded-full border">
                      <Image
                        src={featuredArticle.author.avatar}
                        alt={featuredArticle.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-text text-sm font-bold">{featuredArticle.author.name}</h4>
                      <p className="text-text-muted text-xs font-medium">{featuredArticle.date}</p>
                    </div>
                  </div>
                  <span className="text-text-muted text-xs font-semibold">
                    {featuredArticle.readTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Directory filter tabs & Articles list */}
      <section className="py-20">
        <Container>
          {/* Categories Tab navigation bar */}
          <div className="border-border mb-12 flex scrollbar-none items-center gap-2 overflow-x-auto border-b pb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`focus-visible:outline-brand cursor-pointer rounded-full px-5 py-2 text-sm font-semibold whitespace-nowrap transition-all focus-visible:outline focus-visible:outline-2 ${
                  activeCategory === category
                    ? "bg-text text-canvas"
                    : "bg-canvas-muted text-text-muted hover:bg-canvas hover:text-text border-border hover:border-text-muted border"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <SectionHeader
            title={`${activeCategory === "All" ? "Recent" : activeCategory} Articles`}
            subtitle="Explore comprehensive logs, visual mockups, and deployment guides."
          />

          {filteredArticles.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  title={article.title}
                  description={article.description}
                  imageSrc={article.imageSrc}
                  imageAlt={article.title}
                  badge={article.category}
                  date={article.date}
                  readTime={article.readTime}
                  href={`/stories/${article.slug}`}
                  aspectRatio="video"
                >
                  <div className="border-border flex items-center gap-3 border-t pt-4">
                    <div className="border-border relative h-8 w-8 overflow-hidden rounded-full border">
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-text text-xs font-bold">{article.author.name}</h4>
                      <p className="text-text-muted text-[10px] font-medium">
                        {article.author.title}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border-border bg-canvas-muted rounded-3xl border py-16 text-center">
              <p className="text-text-muted text-lg">No articles found in this category.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setActiveCategory("All")}
              >
                Reset Category Filters
              </Button>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
