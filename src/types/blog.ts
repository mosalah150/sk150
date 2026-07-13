export interface Author {
  name: string;
  avatar: string;
  title: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string[]; // Content split by paragraphs for clean parsing
  imageSrc: string;
  category: "Design" | "Performance" | "DevOps" | "Sports";
  tags: string[];
  date: string;
  readTime: string;
  author: Author;
  publishedTime: string; // ISO String for SEO schema metadata
}
