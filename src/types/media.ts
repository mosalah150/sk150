export interface Video {
  id: string;
  title: string;
  description: string;
  platform: "youtube" | "tiktok";
  videoId: string;
  category: string;
  duration: string;
  date: string;
  coverImage: string;
}
