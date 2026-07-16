/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-anonymous-default-export */
import { studentProfiles } from "./utils/spotlightData";
import { articles } from "./utils/blogData";
import { events } from "./utils/eventData";
import { downloadFiles } from "./utils/downloadData";
import { timelineEvents } from "./utils/timelineData";
import { galleryImages } from "./utils/galleryData";
import { videos } from "./utils/mediaData";

export interface Env {
  DB: D1Database;
  ASSETS_KV: KVNamespace;
  ASSETS: { fetch: typeof fetch };
}

// Simple security password
const ADMIN_PASSWORD = "sk150password";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Cors headers for local dev
    const headers = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });

    if (request.method === "OPTIONS") {
      return new Response(null, { headers, status: 204 });
    }

    // Helper auth checker
    const checkAuth = (req: Request) => {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) return false;
      const token = authHeader.replace("Bearer ", "");
      return token === ADMIN_PASSWORD;
    };

    // 1. GET ALL TELEMETRY DATA & AUTO-SEED
    if (url.pathname === "/api/data" && request.method === "GET") {
      try {
        // Query to check if students exist
        let studentsRes = await env.DB.prepare("SELECT * FROM students").all();

        // Auto-seed if students table is empty
        if (!studentsRes.results || studentsRes.results.length === 0) {
          console.log("Database is empty. Auto-seeding default Thai mock data...");

          // Seed Students
          for (const s of studentProfiles) {
            await env.DB.prepare(
              "INSERT INTO students (id, name, title, achievement, instagram, tiktok, youtube, imageSrc, metrics, bioParagraphs, highlightQuote) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            )
              .bind(
                s.id,
                s.name,
                s.title,
                s.achievement,
                s.instagram || "",
                s.tiktok || "",
                s.youtube || "",
                s.imageSrc,
                JSON.stringify(s.metrics),
                JSON.stringify(s.bioParagraphs),
                s.highlightQuote,
              )
              .run();
          }

          // Seed Posts
          for (const a of articles) {
            await env.DB.prepare(
              "INSERT INTO posts (id, slug, title, description, imageSrc, category, tags, date, readTime, publishedTime, authorName, authorAvatar, authorTitle, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            )
              .bind(
                a.id,
                a.slug,
                a.title,
                a.description,
                a.imageSrc,
                a.category,
                JSON.stringify(a.tags),
                a.date,
                a.readTime,
                a.publishedTime,
                a.author.name,
                a.author.avatar,
                a.author.title,
                JSON.stringify(a.content),
              )
              .run();
          }

          // Seed Events
          for (const e of events) {
            await env.DB.prepare(
              "INSERT INTO events (id, title, description, type, date, time, location, locationType, countdownTarget, coverImage, galleryImages, videoUrl, phase) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            )
              .bind(
                e.id,
                e.title,
                e.description,
                e.type,
                e.date,
                e.time,
                e.location,
                e.locationType,
                e.countdownTarget || "",
                e.coverImage,
                JSON.stringify(e.galleryImages),
                e.videoUrl || "",
                e.phase,
              )
              .run();
          }

          // Seed Media (Videos)
          for (const v of videos) {
            await env.DB.prepare(
              "INSERT INTO media (id, title, description, platform, videoId, category, duration, date, coverImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            )
              .bind(
                v.id,
                v.title,
                v.description,
                v.platform,
                v.videoId,
                v.category,
                v.duration,
                v.date,
                v.coverImage,
              )
              .run();
          }

          // Seed Downloads
          for (const d of downloadFiles) {
            await env.DB.prepare(
              "INSERT INTO downloads (id, title, description, category, fileSize, fileExtension, href) VALUES (?, ?, ?, ?, ?, ?, ?)",
            )
              .bind(d.id, d.title, d.description, d.category, d.fileSize, d.fileExtension, d.href)
              .run();
          }

          // Seed Timeline
          for (const t of timelineEvents) {
            await env.DB.prepare(
              "INSERT INTO timeline (id, title, subtitle, phase, imageSrc, tags, description, bullets, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            )
              .bind(
                t.id,
                t.title,
                t.subtitle,
                t.phase,
                t.imageSrc,
                JSON.stringify(t.tags),
                t.description,
                JSON.stringify(t.bullets),
                t.date,
              )
              .run();
          }

          // Seed Gallery
          for (const g of galleryImages) {
            await env.DB.prepare(
              "INSERT INTO gallery (id, title, description, imageSrc, album, aspectRatio, location, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            )
              .bind(
                g.id,
                g.title,
                g.description,
                g.imageSrc,
                g.album,
                g.aspectRatio,
                g.location || "",
                g.date || "",
              )
              .run();
          }

          // Re-query students after seeding
          studentsRes = await env.DB.prepare("SELECT * FROM students").all();
        }

        // Check if menus exist, if not seed it
        let menusRes = await env.DB.prepare("SELECT * FROM menus ORDER BY sortOrder ASC").all();
        if (!menusRes.results || menusRes.results.length === 0) {
          const defaultMenus = [
            { id: "menu-1", label: "ความทรงจำ", href: "/stories", sortOrder: 1 },
            { id: "menu-2", label: "แกลเลอรี", href: "/gallery", sortOrder: 2 },
            { id: "menu-3", label: "วิดีโอ", href: "/media", sortOrder: 3 },
            { id: "menu-4", label: "ทำเนียบรุ่น", href: "/spotlight", sortOrder: 4 },
            { id: "menu-5", label: "ไทม์ไลน์", href: "/timeline", sortOrder: 5 },
            { id: "menu-6", label: "กิจกรรม", href: "/events", sortOrder: 6 },
          ];
          for (const m of defaultMenus) {
            await env.DB.prepare("INSERT INTO menus (id, label, href, sortOrder) VALUES (?, ?, ?, ?)")
              .bind(m.id, m.label, m.href, m.sortOrder)
              .run();
          }
          menusRes = await env.DB.prepare("SELECT * FROM menus ORDER BY sortOrder ASC").all();
        }

        // Check if homepage_sections exist, if not seed it
        let sectionsRes = await env.DB.prepare("SELECT * FROM homepage_sections ORDER BY sortOrder ASC").all();
        if (!sectionsRes.results || sectionsRes.results.length === 0) {
          const defaultSections = [
            { id: "portal", title: "ค้นหาความทรงจำตามหมวดหมู่", subtitle: "เข้าถึงภาพความทรงจำ ไดอารี่เรื่องเล่า และวิดีโอย้อนหลังได้อย่างสะดวกรวดเร็ว", hidden: 0, sortOrder: 1 },
            { id: "spotlight", title: "นักเรียนเด่นประจำรุ่น", subtitle: "เรื่องราวประวัติและสัมภาษณ์เพื่อนร่วมชั้นเรียนคนสำคัญ", hidden: 0, sortOrder: 2 },
            { id: "stories", title: "บันทึกความทรงจำ", subtitle: "เรื่องราว ภาพถ่าย และบันทึกเหตุการณ์ประทับใจในช่วงเรียนร่วมรุ่นกันของพวกเรา", hidden: 0, sortOrder: 3 },
            { id: "gallery", title: "ภาพความทรงจำประทับใจ", subtitle: "รวบรวมภาพบันทึกจังหวะชีวิตกิจกรรม วัยเรียน และความร่วมมือในผลงานรุ่นต่างๆ", hidden: 0, sortOrder: 4 },
            { id: "videos", title: "วิดีโอเด่นความทรงจำ", subtitle: "บันทึกเทปงานพิธีสำคัญ ไฮไลท์กิจกรรมโรงเรียน และสารคดีประมวลผลงานของรุ่น", hidden: 0, sortOrder: 5 },
            { id: "events", title: "กิจกรรมของรุ่น", subtitle: "พบปะพูดคุยและสร้างสรรค์กิจกรรมดีๆ ร่วมกันระหว่างเพื่อนร่วมชั้นเรียน", hidden: 0, sortOrder: 6 },
          ];
          for (const s of defaultSections) {
            await env.DB.prepare("INSERT INTO homepage_sections (id, title, subtitle, hidden, sortOrder) VALUES (?, ?, ?, ?, ?)")
              .bind(s.id, s.title, s.subtitle, s.hidden, s.sortOrder)
              .run();
          }
          sectionsRes = await env.DB.prepare("SELECT * FROM homepage_sections ORDER BY sortOrder ASC").all();
        }

        // Fetch other tables
        const postsRes = await env.DB.prepare("SELECT * FROM posts").all();
        const eventsRes = await env.DB.prepare("SELECT * FROM events").all();
        const mediaRes = await env.DB.prepare("SELECT * FROM media").all();
        const downloadsRes = await env.DB.prepare("SELECT * FROM downloads").all();
        const timelineRes = await env.DB.prepare("SELECT * FROM timeline").all();
        const galleryRes = await env.DB.prepare("SELECT * FROM gallery").all();

        // Map D1 rows back to frontend formats
        const mappedStudents = studentsRes.results.map((s: any) => ({
          ...s,
          metrics: JSON.parse(s.metrics),
          bioParagraphs: JSON.parse(s.bioParagraphs),
        }));

        const mappedPosts = postsRes.results.map((p: any) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          description: p.description,
          imageSrc: p.imageSrc,
          category: p.category,
          tags: JSON.parse(p.tags),
          date: p.date,
          readTime: p.readTime,
          publishedTime: p.publishedTime,
          author: {
            name: p.authorName,
            avatar: p.authorAvatar,
            title: p.authorTitle,
          },
          content: JSON.parse(p.content),
        }));

        const mappedEvents = eventsRes.results.map((e: any) => ({
          ...e,
          galleryImages: JSON.parse(e.galleryImages),
        }));

        const mappedTimeline = timelineRes.results.map((t: any) => ({
          ...t,
          tags: JSON.parse(t.tags),
          bullets: JSON.parse(t.bullets),
        }));

        return new Response(
          JSON.stringify({
            students: mappedStudents,
            posts: mappedPosts,
            events: mappedEvents,
            media: mediaRes.results,
            downloads: downloadsRes.results,
            timeline: mappedTimeline,
            gallery: galleryRes.results,
            menus: menusRes.results,
            sections: sectionsRes.results,
          }),
          { headers: { ...headers, "Content-Type": "application/json" } },
        );
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }
    }

    // 2. FILE UPLOADER TO KV
    if (url.pathname === "/api/upload" && request.method === "POST") {
      if (!checkAuth(request)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }

      try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        if (!file) {
          return new Response(JSON.stringify({ error: "No file uploaded" }), {
            status: 400,
            headers: { ...headers, "Content-Type": "application/json" },
          });
        }

        const extension = file.name.split(".").pop();
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;

        // Convert file data to ArrayBuffer for KV Storage
        const arrayBuffer = await file.arrayBuffer();
        await env.ASSETS_KV.put(filename, arrayBuffer, {
          metadata: { contentType: file.type },
        });

        const fileUrl = `/api/media/${filename}`;
        return new Response(JSON.stringify({ url: fileUrl }), {
          headers: { ...headers, "Content-Type": "application/json" },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }
    }

    // 3. MEDIA FILE RETRIEVAL / STREAMER FROM KV
    if (url.pathname.startsWith("/api/media/")) {
      const filename = url.pathname.substring("/api/media/".length);
      try {
        const { value, metadata } = await env.ASSETS_KV.getWithMetadata<{ contentType?: string }>(
          filename,
          { type: "stream" },
        );

        if (!value) {
          return new Response("Media file not found", { status: 404 });
        }

        const contentType = metadata?.contentType || "application/octet-stream";
        return new Response(value, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (err: any) {
        return new Response("Error retrieving media", { status: 500 });
      }
    }

    // 4. ADMIN SAVE / INSERT DATA
    if (url.pathname === "/api/save" && request.method === "POST") {
      if (!checkAuth(request)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }

      try {
        const body = (await request.json()) as any;
        const { type, data } = body;

        if (type === "posts") {
          await env.DB.prepare(
            "INSERT INTO posts (id, slug, title, description, imageSrc, category, tags, date, readTime, publishedTime, authorName, authorAvatar, authorTitle, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET slug=excluded.slug, title=excluded.title, description=excluded.description, imageSrc=excluded.imageSrc, category=excluded.category, tags=excluded.tags, date=excluded.date, readTime=excluded.readTime, content=excluded.content",
          )
            .bind(
              data.id,
              data.slug,
              data.title,
              data.description,
              data.imageSrc,
              data.category,
              JSON.stringify(data.tags),
              data.date,
              data.readTime,
              data.publishedTime,
              data.authorName || (data.author ? data.author.name : "แอดมินรุ่น"),
              data.authorAvatar || (data.author ? data.author.avatar : "/assets/spotlight.png"),
              data.authorTitle || (data.author ? data.author.title : "คณะกรรมการรุ่น 150"),
              JSON.stringify(data.content),
            )
            .run();
        } else if (type === "students") {
          await env.DB.prepare(
            "INSERT INTO students (id, name, title, achievement, instagram, tiktok, youtube, imageSrc, metrics, bioParagraphs, highlightQuote) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name=excluded.name, title=excluded.title, achievement=excluded.achievement, instagram=excluded.instagram, tiktok=excluded.tiktok, youtube=excluded.youtube, imageSrc=excluded.imageSrc, metrics=excluded.metrics, bioParagraphs=excluded.bioParagraphs, highlightQuote=excluded.highlightQuote",
          )
            .bind(
              data.id,
              data.name,
              data.title,
              data.achievement,
              data.instagram || "",
              data.tiktok || "",
              data.youtube || "",
              data.imageSrc,
              JSON.stringify(data.metrics),
              JSON.stringify(data.bioParagraphs),
              data.highlightQuote,
            )
            .run();
        } else if (type === "events") {
          await env.DB.prepare(
            "INSERT INTO events (id, title, description, type, date, time, location, locationType, countdownTarget, coverImage, galleryImages, videoUrl, phase) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET title=excluded.title, description=excluded.description, type=excluded.type, date=excluded.date, time=excluded.time, location=excluded.location, locationType=excluded.locationType, countdownTarget=excluded.countdownTarget, coverImage=excluded.coverImage, galleryImages=excluded.galleryImages, videoUrl=excluded.videoUrl, phase=excluded.phase",
          )
            .bind(
              data.id,
              data.title,
              data.description,
              data.type,
              data.date,
              data.time,
              data.location,
              data.locationType,
              data.countdownTarget || "",
              data.coverImage,
              JSON.stringify(data.galleryImages),
              data.videoUrl || "",
              data.phase,
            )
            .run();
        } else if (type === "media") {
          let resolvedCover = data.coverImage || "";
          
          // Auto resolve cover image if empty or generic
          if (data.platform === "youtube" || data.platform === "youtube-shorts") {
            resolvedCover = `https://img.youtube.com/vi/${data.videoId}/hqdefault.jpg`;
          } else if (data.platform === "tiktok") {
            if (!resolvedCover || resolvedCover.includes("placeholder") || resolvedCover === "") {
              try {
                // Fetch oEmbed from TikTok to fetch the video details dynamically
                const oembedRes = await fetch(`https://www.tiktok.com/oembed?url=https://www.tiktok.com/@tiktok/video/${data.videoId}`);
                if (oembedRes.ok) {
                  const oembedData: any = await oembedRes.json();
                  if (oembedData && oembedData.thumbnail_url) {
                    resolvedCover = oembedData.thumbnail_url;
                  }
                }
              } catch (e) {
                console.error("Error fetching TikTok thumbnail:", e);
              }
            }
          }

          if (!resolvedCover) {
            resolvedCover = "/assets/hero_bg.png"; // final fallback
          }

          await env.DB.prepare(
            "INSERT INTO media (id, title, description, platform, videoId, category, duration, date, coverImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET title=excluded.title, description=excluded.description, platform=excluded.platform, videoId=excluded.videoId, category=excluded.category, duration=excluded.duration, date=excluded.date, coverImage=excluded.coverImage",
          )
            .bind(
              data.id,
              data.title,
              data.description,
              data.platform,
              data.videoId,
              data.category,
              data.duration,
              data.date,
              resolvedCover,
            )
            .run();
        } else if (type === "gallery") {
          await env.DB.prepare(
            "INSERT INTO gallery (id, title, description, imageSrc, album, aspectRatio, location, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET title=excluded.title, description=excluded.description, imageSrc=excluded.imageSrc, album=excluded.album, aspectRatio=excluded.aspectRatio, location=excluded.location, date=excluded.date",
          )
            .bind(
              data.id,
              data.title,
              data.description,
              data.imageSrc,
              data.album,
              data.aspectRatio,
              data.location || "",
              data.date || "",
            )
            .run();
        } else if (type === "downloads") {
          await env.DB.prepare(
            "INSERT INTO downloads (id, title, description, category, fileSize, fileExtension, href) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET title=excluded.title, description=excluded.description, category=excluded.category, fileSize=excluded.fileSize, fileExtension=excluded.fileExtension, href=excluded.href",
          )
            .bind(
              data.id,
              data.title,
              data.description,
              data.category,
              data.fileSize,
              data.fileExtension,
              data.href,
            )
            .run();
        } else if (type === "menus") {
          await env.DB.prepare(
            "INSERT INTO menus (id, label, href, sortOrder) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET label=excluded.label, href=excluded.href, sortOrder=excluded.sortOrder",
          )
            .bind(
              data.id,
              data.label,
              data.href,
              Number(data.sortOrder),
            )
            .run();
        } else if (type === "homepage_sections") {
          await env.DB.prepare(
            "INSERT INTO homepage_sections (id, title, subtitle, hidden, sortOrder) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET title=excluded.title, subtitle=excluded.subtitle, hidden=excluded.hidden, sortOrder=excluded.sortOrder",
          )
            .bind(
              data.id,
              data.title,
              data.subtitle,
              Number(data.hidden),
              Number(data.sortOrder),
            )
            .run();
        } else {
          return new Response(JSON.stringify({ error: "Invalid data type" }), {
            status: 400,
            headers: { ...headers, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...headers, "Content-Type": "application/json" },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }
    }

    // 5. AUTH VERIFIER
    if (url.pathname === "/api/auth" && request.method === "POST") {
      try {
        const body = (await request.json()) as any;
        const password = body.password;
        if (password === ADMIN_PASSWORD) {
          return new Response(JSON.stringify({ success: true, token: ADMIN_PASSWORD }), {
            headers: { ...headers, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ error: "Invalid Password" }), {
          status: 401,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }
    }

    // 6. DEFAULT: FORWARD ALL NON-API REQUESTS TO STATIC ASSETS IN `./out`
    return env.ASSETS.fetch(request);
  },
};
