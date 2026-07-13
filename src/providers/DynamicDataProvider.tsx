"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { studentProfiles } from "@/utils/spotlightData";
import { articles } from "@/utils/blogData";
import { events as defaultEvents } from "@/utils/eventData";
import { downloadFiles } from "@/utils/downloadData";
import { timelineEvents } from "@/utils/timelineData";
import { galleryImages } from "@/utils/galleryData";
import { videos } from "@/utils/mediaData";

import { StudentProfile } from "@/types/spotlight";
import { Article } from "@/types/blog";
import { EventItem } from "@/types/event";
import { Video } from "@/types/media";
import { DownloadFile } from "@/types/download";
import { TimelineEvent } from "@/types/timeline";
import { GalleryImage } from "@/utils/galleryData"; // galleryImages uses the type directly

interface DynamicData {
  students: StudentProfile[];
  posts: Article[];
  events: EventItem[];
  media: Video[];
  downloads: DownloadFile[];
  timeline: TimelineEvent[];
  gallery: GalleryImage[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

const DynamicDataContext = createContext<DynamicData | undefined>(undefined);

export function DynamicDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<{
    students: StudentProfile[];
    posts: Article[];
    events: EventItem[];
    media: Video[];
    downloads: DownloadFile[];
    timeline: TimelineEvent[];
    gallery: GalleryImage[];
  }>({
    students: studentProfiles,
    posts: articles,
    events: defaultEvents,
    media: videos,
    downloads: downloadFiles,
    timeline: timelineEvents,
    gallery: galleryImages,
  });

  const [loading, setLoading] = useState(true);

  const fetchLatestData = useCallback(async () => {
    try {
      const res = await fetch("/api/data");
      if (res.ok) {
        const json = await res.json();
        // Fallback to static mock data if DB returns empty tables or missing fields
        setData({
          students: json.students?.length ? json.students : studentProfiles,
          posts: json.posts?.length ? json.posts : articles,
          events: json.events?.length ? json.events : defaultEvents,
          media: json.media?.length ? json.media : videos,
          downloads: json.downloads?.length ? json.downloads : downloadFiles,
          timeline: json.timeline?.length ? json.timeline : timelineEvents,
          gallery: json.gallery?.length ? json.gallery : galleryImages,
        });
      }
    } catch (err) {
      console.warn(
        "Could not load dynamic data from Cloudflare D1. Falling back to local static files.",
        err,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestData();
  }, [fetchLatestData]);

  return (
    <DynamicDataContext.Provider
      value={{
        ...data,
        loading,
        refreshData: fetchLatestData,
      }}
    >
      {children}
    </DynamicDataContext.Provider>
  );
}

export function useDynamicData() {
  const context = useContext(DynamicDataContext);
  if (!context) {
    throw new Error("useDynamicData must be used within a DynamicDataProvider");
  }
  return context;
}
