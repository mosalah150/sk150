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
import { GalleryImage } from "@/utils/galleryData";

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  sortOrder: number;
}

export interface HomepageSection {
  id: string;
  title: string;
  subtitle: string;
  hidden: number; // 0 or 1
  sortOrder: number;
}

const defaultMenus: MenuItem[] = [
  { id: "menu-1", label: "ความทรงจำ", href: "/stories", sortOrder: 1 },
  { id: "menu-2", label: "แกลเลอรี", href: "/gallery", sortOrder: 2 },
  { id: "menu-3", label: "วิดีโอ", href: "/media", sortOrder: 3 },
  { id: "menu-4", label: "ทำเนียบรุ่น", href: "/spotlight", sortOrder: 4 },
  { id: "menu-5", label: "ไทม์ไลน์", href: "/timeline", sortOrder: 5 },
  { id: "menu-6", label: "กิจกรรม", href: "/events", sortOrder: 6 },
];

const defaultSections: HomepageSection[] = [
  { id: "portal", title: "ค้นหาความทรงจำตามหมวดหมู่", subtitle: "เข้าถึงภาพความทรงจำ ไดอารี่เรื่องเล่า และวิดีโอย้อนหลังได้อย่างสะดวกรวดเร็ว", hidden: 0, sortOrder: 1 },
  { id: "spotlight", title: "นักเรียนเด่นประจำรุ่น", subtitle: "เรื่องราวประวัติและสัมภาษณ์เพื่อนร่วมชั้นเรียนคนสำคัญ", hidden: 0, sortOrder: 2 },
  { id: "stories", title: "บันทึกความทรงจำ", subtitle: "เรื่องราว ภาพถ่าย และบันทึกเหตุการณ์ประทับใจในช่วงเรียนร่วมรุ่นกันของพวกเรา", hidden: 0, sortOrder: 3 },
  { id: "gallery", title: "ภาพความทรงจำประทับใจ", subtitle: "รวบรวมภาพบันทึกจังหวะชีวิตกิจกรรม วัยเรียน และความร่วมมือในผลงานรุ่นต่างๆ", hidden: 0, sortOrder: 4 },
  { id: "videos", title: "วิดีโอเด่นความทรงจำ", subtitle: "บันทึกเทปงานพิธีสำคัญ ไฮไลท์กิจกรรมโรงเรียน และสารคดีประมวลผลงานของรุ่น", hidden: 0, sortOrder: 5 },
  { id: "events", title: "กิจกรรมของรุ่น", subtitle: "พบปะพูดคุยและสร้างสรรค์กิจกรรมดีๆ ร่วมกันระหว่างเพื่อนร่วมชั้นเรียน", hidden: 0, sortOrder: 6 },
];

interface DynamicData {
  students: StudentProfile[];
  posts: Article[];
  events: EventItem[];
  media: Video[];
  downloads: DownloadFile[];
  timeline: TimelineEvent[];
  gallery: GalleryImage[];
  menus: MenuItem[];
  sections: HomepageSection[];
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
    menus: MenuItem[];
    sections: HomepageSection[];
  }>({
    students: studentProfiles,
    posts: articles,
    events: defaultEvents,
    media: videos,
    downloads: downloadFiles,
    timeline: timelineEvents,
    gallery: galleryImages,
    menus: defaultMenus,
    sections: defaultSections,
  });

  const [loading, setLoading] = useState(true);

  const fetchLatestData = useCallback(async () => {
    try {
      const res = await fetch("/api/data");
      if (res.ok) {
        const json = await res.json();
        setData({
          students: json.students?.length ? json.students : studentProfiles,
          posts: json.posts?.length ? json.posts : articles,
          events: json.events?.length ? json.events : defaultEvents,
          media: json.media?.length ? json.media : videos,
          downloads: json.downloads?.length ? json.downloads : downloadFiles,
          timeline: json.timeline?.length ? json.timeline : timelineEvents,
          gallery: json.gallery?.length ? json.gallery : galleryImages,
          menus: json.menus?.length ? json.menus : defaultMenus,
          sections: json.sections?.length ? json.sections : defaultSections,
        });
      }
    } catch (err) {
      console.warn(
        "Could not load dynamic data from Cloudflare D1. Falling back to local static files.",
        err
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
