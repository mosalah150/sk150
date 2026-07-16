export interface Video {
  id: string;
  title: string;
  description: string;
  platform: "youtube" | "youtube-shorts" | "tiktok" | "facebook" | "facebook-reel";
  videoId: string;
  category: string;
  duration: string;
  date: string;
  coverImage: string;
}
