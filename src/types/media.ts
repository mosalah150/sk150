export interface Video {
  id: string;
  title: string;
  description: string;
  platform: "youtube" | "tiktok";
  videoId: string;
  category: "Tutorials" | "Panel Talks" | "Creative Highlights";
  duration: string;
  date: string;
  coverImage: string;
}
