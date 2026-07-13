export interface EventItem {
  id: string;
  title: string;
  description: string;
  type: "upcoming" | "past";
  date: string;
  time: string;
  location: string;
  locationType: "physical" | "virtual";
  countdownTarget?: string; // ISO string date for live countdown
  coverImage: string;
  galleryImages: string[];
  videoUrl?: string; // YouTube videoId for recap embeds
  phase: string;
}
