"use client";

import React, { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

// Import core databases for CRUD state initialization
import { articles as initialArticles } from "@/utils/blogData";
import { events as initialEvents } from "@/utils/eventData";
import { galleryImages as initialGallery } from "@/utils/galleryData";
import { videos as initialVideos } from "@/utils/mediaData";
import { downloadFiles as initialDownloads } from "@/utils/downloadData";
import { studentProfiles as initialStudents } from "@/utils/spotlightData";

type AdminTab = "Overview" | "News" | "Events" | "Gallery" | "Videos" | "Downloads" | "Students";

export default function AdminDashboardPage() {
  // 1. Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // 2. Tab Navigation
  const [activeTab, setActiveTab] = useState<AdminTab>("Overview");

  // 3. Database State Collections (for CRUD actions)
  const [articles, setArticles] = useState(initialArticles);
  const [events, setEvents] = useState(initialEvents);
  const [gallery, setGallery] = useState(initialGallery);
  const [videos, setVideos] = useState(initialVideos);
  const [downloads, setDownloads] = useState(initialDownloads);
  const [students, setStudents] = useState(initialStudents);

  // 4. Cloudflare D1 SQL & R2 Storage Telemetry Logs
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    "[SYSTEM] Ready. Authentication node initialized.",
    "[D1] Initialized connection to database: sk150_production.db",
    "[R2] Connected to storage bucket: sk150_assets_bucket",
  ]);

  // 5. Generic Form State
  const [formInputs, setFormInputs] = useState({
    title: "",
    description: "",
    category: "",
    name: "",
    role: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const addLog = (log: string) => {
    setTelemetryLogs((prev) => [...prev, log]);
  };

  // Google Authentication simulator
  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsLoggingIn(false);
      addLog("[AUTH] Google Sign-In succeeded for: admin@sk150.pages.dev");
    }, 1200);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab("Overview");
    addLog("[AUTH] Admin User logged out.");
  };

  // Helper clear inputs
  const resetForm = () => {
    setFormInputs({ title: "", description: "", category: "", name: "", role: "" });
    setEditingId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({ ...prev, [name]: value }));
  };

  // --- CRUD HANDLERS ---

  // Stories (News) CRUD
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInputs.title || !formInputs.description) return;

    if (editingId) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? { ...a, title: formInputs.title, description: formInputs.description }
            : a,
        ),
      );
      addLog(
        `[D1 SQL] UPDATE articles SET title='${formInputs.title}', description='${formInputs.description}' WHERE id='${editingId}';`,
      );
    } else {
      const newArticle = {
        id: (articles.length + 1).toString(),
        slug: formInputs.title.toLowerCase().replace(/ /g, "-"),
        title: formInputs.title,
        description: formInputs.description,
        content: ["Placeholder paragraph details compiled in Admin panel."],
        imageSrc: "/assets/gallery_2.png",
        category: "Design" as const,
        tags: ["System"],
        date: "Today",
        readTime: "3 min read",
        publishedTime: new Date().toISOString(),
        author: { name: "Admin", avatar: "/assets/spotlight.png", title: "Operator" },
      };
      setArticles((prev) => [newArticle, ...prev]);
      addLog(
        `[D1 SQL] INSERT INTO articles (id, slug, title, category) VALUES ('${newArticle.id}', '${newArticle.slug}', '${newArticle.title}', '${newArticle.category}');`,
      );
    }
    resetForm();
  };

  // Events CRUD
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInputs.title || !formInputs.description) return;

    if (editingId) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editingId
            ? { ...ev, title: formInputs.title, description: formInputs.description }
            : ev,
        ),
      );
      addLog(
        `[D1 SQL] UPDATE events SET title='${formInputs.title}', description='${formInputs.description}' WHERE id='${editingId}';`,
      );
    } else {
      const newEvent = {
        id: (events.length + 1).toString(),
        title: formInputs.title,
        description: formInputs.description,
        type: "upcoming" as const,
        date: "TBD",
        time: "TBD",
        location: "Virtual Stage",
        locationType: "virtual" as const,
        coverImage: "/assets/gallery_1.png",
        galleryImages: ["/assets/gallery_1.png"],
        phase: "Admin Created Stage",
      };
      setEvents((prev) => [newEvent, ...prev]);
      addLog(
        `[D1 SQL] INSERT INTO events (id, title, description, phase) VALUES ('${newEvent.id}', '${newEvent.title}', '${newEvent.description}', '${newEvent.phase}');`,
      );
    }
    resetForm();
  };

  // Gallery CRUD & Cloudflare R2 Upload Simulation
  const handleR2UploadSimulate = () => {
    const mockFilename = `gallery_${Math.floor(Math.random() * 1000)}.png`;
    const mockSize = `${(Math.random() * 5 + 1).toFixed(1)} MB`;

    addLog(`[R2 OBJECT] PUT /r2/gallery/${mockFilename} HTTP/1.1 (Payload: ${mockSize})`);
    setTimeout(() => {
      const newImg = {
        id: (gallery.length + 1).toString(),
        title: `Uploaded Asset: ${mockFilename}`,
        description: "Mock file stored on Cloudflare R2",
        imageSrc: "/assets/gallery_1.png",
        album: "Visual Art" as const,
        aspectRatio: "video" as const,
        location: "Edge Storage Node",
        date: "July 2026",
      };
      setGallery((prev) => [newImg, ...prev]);
      addLog(`[R2 OBJECT] HTTP/1.1 200 OK. Saved to bucket. Size: ${mockSize}`);
      addLog(
        `[D1 SQL] INSERT INTO gallery_images (id, title, imageSrc) VALUES ('${newImg.id}', '${newImg.title}', '${newImg.imageSrc}');`,
      );
    }, 800);
  };

  // Videos CRUD
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInputs.title || !formInputs.description) return;

    if (editingId) {
      setVideos((prev) =>
        prev.map((v) =>
          v.id === editingId
            ? { ...v, title: formInputs.title, description: formInputs.description }
            : v,
        ),
      );
      addLog(
        `[D1 SQL] UPDATE videos SET title='${formInputs.title}', description='${formInputs.description}' WHERE id='${editingId}';`,
      );
    } else {
      const newVideo = {
        id: (videos.length + 1).toString(),
        title: formInputs.title,
        description: formInputs.description,
        platform: "youtube" as const,
        videoId: "dQw4w9WgXcQ",
        category: "Tutorials" as const,
        duration: "10:00",
        date: "TBD",
        coverImage: "/assets/gallery_3.png",
      };
      setVideos((prev) => [newVideo, ...prev]);
      addLog(
        `[D1 SQL] INSERT INTO videos (id, title, videoId, platform) VALUES ('${newVideo.id}', '${newVideo.title}', '${newVideo.videoId}', '${newVideo.platform}');`,
      );
    }
    resetForm();
  };

  // Downloads CRUD
  const handleSaveDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInputs.title || !formInputs.description) return;

    if (editingId) {
      setDownloads((prev) =>
        prev.map((d) =>
          d.id === editingId
            ? { ...d, title: formInputs.title, description: formInputs.description }
            : d,
        ),
      );
      addLog(
        `[D1 SQL] UPDATE downloads SET title='${formInputs.title}', description='${formInputs.description}' WHERE id='${editingId}';`,
      );
    } else {
      const newDownload = {
        id: (downloads.length + 1).toString(),
        title: formInputs.title,
        description: formInputs.description,
        category: "PDF" as const,
        fileSize: "1.0 MB",
        fileExtension: "PDF",
        href: "#",
      };
      setDownloads((prev) => [newDownload, ...prev]);
      addLog(
        `[D1 SQL] INSERT INTO downloads (id, title, fileSize, fileExtension) VALUES ('${newDownload.id}', '${newDownload.title}', '${newDownload.fileSize}', '${newDownload.fileExtension}');`,
      );
    }
    resetForm();
  };

  // Students CRUD
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInputs.name || !formInputs.role) return;

    if (editingId) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === editingId ? { ...s, name: formInputs.name, title: formInputs.role } : s,
        ),
      );
      addLog(
        `[D1 SQL] UPDATE students SET name='${formInputs.name}', title='${formInputs.role}' WHERE id='${editingId}';`,
      );
    } else {
      const newStudent = {
        id: (students.length + 1).toString(),
        name: formInputs.name,
        title: formInputs.role,
        achievement: "Spotlight Highlight",
        bioParagraphs: ["Profile added via admin panel."],
        imageSrc: "/assets/spotlight.png",
        instagram: "#",
        tiktok: "#",
        youtube: "#",
        metrics: [{ label: "Added", value: "Today" }],
        highlightQuote: "Dynamic student profile synced.",
      };
      setStudents((prev) => [newStudent, ...prev]);
      addLog(
        `[D1 SQL] INSERT INTO students (id, name, title, achievement) VALUES ('${newStudent.id}', '${newStudent.name}', '${newStudent.title}', '${newStudent.achievement}');`,
      );
    }
    resetForm();
  };

  // Global Delete Handler
  const handleDeleteItem = (id: string, type: AdminTab) => {
    if (!confirm(`Are you sure you want to delete item: ${id}?`)) return;

    switch (type) {
      case "News":
        setArticles((prev) => prev.filter((a) => a.id !== id));
        addLog(`[D1 SQL] DELETE FROM articles WHERE id='${id}';`);
        break;
      case "Events":
        setEvents((prev) => prev.filter((e) => e.id !== id));
        addLog(`[D1 SQL] DELETE FROM events WHERE id='${id}';`);
        break;
      case "Gallery":
        setGallery((prev) => prev.filter((g) => g.id !== id));
        addLog(`[D1 SQL] DELETE FROM gallery_images WHERE id='${id}';`);
        break;
      case "Videos":
        setVideos((prev) => prev.filter((v) => v.id !== id));
        addLog(`[D1 SQL] DELETE FROM videos WHERE id='${id}';`);
        break;
      case "Downloads":
        setDownloads((prev) => prev.filter((d) => d.id !== id));
        addLog(`[D1 SQL] DELETE FROM downloads WHERE id='${id}';`);
        break;
      case "Students":
        setStudents((prev) => prev.filter((s) => s.id !== id));
        addLog(`[D1 SQL] DELETE FROM students WHERE id='${id}';`);
        break;
      default:
        break;
    }
  };

  const handleEditTrigger = (
    item: {
      id: string;
      name?: string;
      title?: string;
      description?: string;
      category?: string;
    },
    type: AdminTab,
  ) => {
    setEditingId(item.id);
    if (type === "Students") {
      setFormInputs({
        title: "",
        description: "",
        category: "",
        name: item.name || "",
        role: item.title || "",
      });
    } else {
      setFormInputs({
        title: item.title || "",
        description: item.description || "",
        category: item.category || "",
        name: "",
        role: "",
      });
    }
  };

  return (
    <div className="bg-canvas text-text min-h-screen flex-1 transition-colors duration-200">
      {/* CASE A: Guest Sign-In Screen */}
      {!isLoggedIn ? (
        <section className="flex min-h-[80vh] items-center justify-center py-24 sm:py-32">
          <div className="border-border bg-canvas-muted w-[90%] max-w-md rounded-[32px] border p-8 text-center shadow-2xl backdrop-blur-md sm:p-12">
            <span className="text-brand block text-xs font-bold tracking-widest uppercase">
              SK150 Platform
            </span>
            <h1 className="text-text mt-3 text-3xl font-black tracking-tight">Management Panel</h1>
            <p className="text-text-muted mt-4 text-xs leading-relaxed sm:text-sm">
              Sign in with your Google Workspace profile to manage news logs, visual folders,
              roadmap timelines, and object downloads.
            </p>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="bg-canvas text-text border-border hover:border-text-muted mt-10 flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border py-3.5 text-sm font-bold shadow-sm transition-all hover:scale-101 active:scale-99"
            >
              {isLoggingIn ? (
                <>
                  <div className="border-text-muted h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                  Authorizing...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.14 3.01-1.07 4.02l3.12 2.42c1.83-1.69 3-4.17 3-7.29z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.97-1.09 7.96-2.96l-3.12-2.42c-.9.6-2.06.96-3.34.96-2.57 0-4.75-1.74-5.53-4.07L4.75 18.03C6.72 21.94 10.74 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M6.47 15.51c-.2-.6-.31-1.24-.31-1.9 0-.66.11-1.3.31-1.9L3.38 9.29C2.49 11.09 2 13.08 2 15.2s.49 4.11 1.38 5.91l3.09-2.4c-.11-.4-.2-.8-.2-1.2z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 10.74 0 6.72 2.06 4.75 5.97L7.84 8.37c.78-2.33 2.96-4.07 5.53-4.07z"
                    />
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>
          </div>
        </section>
      ) : (
        /* CASE B: Authenticated Admin Dashboard */
        <div className="flex min-h-screen flex-col lg:flex-row">
          {/* Sidebar Controller Drawer */}
          <aside className="border-border bg-canvas-muted flex w-full shrink-0 flex-col justify-between border-r p-6 text-left lg:w-64">
            <div>
              <div className="border-border mb-10 flex items-center gap-3 border-b pb-4">
                <div className="bg-brand text-canvas flex h-9 w-9 items-center justify-center rounded-full text-sm font-black">
                  A
                </div>
                <div>
                  <h4 className="text-text text-sm font-bold">Admin Panel</h4>
                  <p className="text-text-muted text-[10px] font-medium">sk150.pages.dev</p>
                </div>
              </div>

              {/* Sidebar Menu items */}
              <nav className="flex flex-col space-y-1.5">
                {(
                  [
                    "Overview",
                    "News",
                    "Events",
                    "Gallery",
                    "Videos",
                    "Downloads",
                    "Students",
                  ] as AdminTab[]
                ).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      resetForm();
                    }}
                    className={`w-full cursor-pointer rounded-xl px-4 py-2.5 text-left text-sm font-bold transition-all ${
                      activeTab === tab
                        ? "bg-text text-canvas"
                        : "text-text-muted hover:bg-canvas hover:text-text"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="border-border mt-10 flex items-center justify-between border-t pt-4">
              <span className="text-text-muted text-[10px] font-bold uppercase">Authorized</span>
              <button
                onClick={handleLogout}
                className="cursor-pointer text-xs font-bold text-rose-500 hover:text-rose-600"
              >
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main Working Stage */}
          <main className="flex flex-1 flex-col justify-between p-6 text-left sm:p-10">
            {/* Top Area: Active Segment CRUD */}
            <div>
              <div className="border-border mb-8 flex items-center justify-between border-b pb-4">
                <h1 className="text-2xl font-black tracking-tight">{activeTab} Management</h1>
                <span className="text-text-muted text-xs font-bold uppercase">
                  Production Database
                </span>
              </div>

              {/* 1. OVERVIEW SCREEN */}
              {activeTab === "Overview" && (
                <div className="animate-in fade-in space-y-8 duration-200">
                  <div className="grid gap-6 sm:grid-cols-3">
                    <div className="border-border bg-canvas rounded-3xl border p-6">
                      <span className="text-text-muted block text-xs font-bold tracking-wider uppercase">
                        Cloudflare D1 tables
                      </span>
                      <span className="mt-2 block text-3xl font-black">6 Active</span>
                    </div>
                    <div className="border-border bg-canvas rounded-3xl border p-6">
                      <span className="text-text-muted block text-xs font-bold tracking-wider uppercase">
                        R2 storage bucket
                      </span>
                      <span className="mt-2 block text-3xl font-black">24 Assets</span>
                    </div>
                    <div className="border-border bg-canvas rounded-3xl border p-6">
                      <span className="text-text-muted block text-xs font-bold tracking-wider uppercase">
                        Edge TTFB Response
                      </span>
                      <span className="text-brand mt-2 block text-3xl font-black">8 ms avg</span>
                    </div>
                  </div>

                  <div className="border-border bg-canvas rounded-3xl border p-6 sm:p-8">
                    <h3 className="text-lg font-bold">SQL Tables Summary</h3>
                    <div className="text-text-muted mt-4 grid gap-2 text-xs font-semibold">
                      <div className="border-border flex justify-between border-b py-2">
                        <span>articles</span>
                        <span>{articles.length} rows</span>
                      </div>
                      <div className="border-border flex justify-between border-b py-2">
                        <span>events</span>
                        <span>{events.length} rows</span>
                      </div>
                      <div className="border-border flex justify-between border-b py-2">
                        <span>gallery_images</span>
                        <span>{gallery.length} rows</span>
                      </div>
                      <div className="border-border flex justify-between border-b py-2">
                        <span>videos</span>
                        <span>{videos.length} rows</span>
                      </div>
                      <div className="border-border flex justify-between border-b py-2">
                        <span>downloads</span>
                        <span>{downloads.length} rows</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span>students</span>
                        <span>{students.length} rows</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. NEWS/STORIES CRUD */}
              {activeTab === "News" && (
                <div className="animate-in fade-in space-y-8 duration-200">
                  {/* Article Form */}
                  <form
                    onSubmit={handleSaveArticle}
                    className="bg-canvas-muted border-border space-y-4 rounded-3xl border p-6"
                  >
                    <h4 className="text-sm font-bold">
                      {editingId ? "Edit Article" : "Create New Article"}
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        name="title"
                        placeholder="Article Title"
                        value={formInputs.title}
                        onChange={handleInputChange}
                        className="bg-canvas border-border focus:border-brand w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none"
                        required
                      />
                      <input
                        type="text"
                        name="description"
                        placeholder="Short summary description"
                        value={formInputs.description}
                        onChange={handleInputChange}
                        className="bg-canvas border-border focus:border-brand w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm" type="submit">
                        Save (D1 COMMIT)
                      </Button>
                    </div>
                  </form>

                  {/* Articles Grid list */}
                  <div className="space-y-3">
                    {articles.map((item) => (
                      <div
                        key={item.id}
                        className="border-border bg-canvas hover:border-text-muted flex items-center justify-between rounded-2xl border p-4 transition-colors"
                      >
                        <div>
                          <h5 className="text-sm font-bold">{item.title}</h5>
                          <p className="text-text-muted mt-1 text-xs">{item.description}</p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => handleEditTrigger(item, "News")}
                            className="text-brand cursor-pointer text-xs font-bold hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, "News")}
                            className="cursor-pointer text-xs font-bold text-rose-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. EVENTS CRUD */}
              {activeTab === "Events" && (
                <div className="animate-in fade-in space-y-8 duration-200">
                  <form
                    onSubmit={handleSaveEvent}
                    className="bg-canvas-muted border-border space-y-4 rounded-3xl border p-6"
                  >
                    <h4 className="text-sm font-bold">
                      {editingId ? "Edit Event" : "Create New Event"}
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        name="title"
                        placeholder="Event Title"
                        value={formInputs.title}
                        onChange={handleInputChange}
                        className="bg-canvas border-border focus:border-brand w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none"
                        required
                      />
                      <input
                        type="text"
                        name="description"
                        placeholder="Event Description"
                        value={formInputs.description}
                        onChange={handleInputChange}
                        className="bg-canvas border-border focus:border-brand w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm" type="submit">
                        Save (D1 COMMIT)
                      </Button>
                    </div>
                  </form>

                  <div className="space-y-3">
                    {events.map((item) => (
                      <div
                        key={item.id}
                        className="border-border bg-canvas hover:border-text-muted flex items-center justify-between rounded-2xl border p-4 transition-colors"
                      >
                        <div>
                          <h5 className="text-sm font-bold">{item.title}</h5>
                          <p className="text-text-muted mt-1 text-xs">{item.description}</p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => handleEditTrigger(item, "Events")}
                            className="text-brand cursor-pointer text-xs font-bold hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, "Events")}
                            className="cursor-pointer text-xs font-bold text-rose-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. GALLERY CRUD & CLOUDFLARE R2 OBJECT UPLOADER */}
              {activeTab === "Gallery" && (
                <div className="animate-in fade-in space-y-8 duration-200">
                  {/* Drop zone uploader simulation */}
                  <div
                    onClick={handleR2UploadSimulate}
                    className="border-border hover:border-brand bg-canvas-muted group cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition-colors duration-200"
                  >
                    <svg
                      className="text-text-muted group-hover:text-brand mx-auto h-10 w-10 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    <h4 className="mt-4 text-sm font-bold">Simulate Cloudflare R2 Upload</h4>
                    <p className="text-text-muted mt-1 text-xs">
                      Click anywhere in this box to upload mock images directly to storage
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {gallery.map((item) => (
                      <div
                        key={item.id}
                        className="border-border bg-canvas hover:border-text-muted flex items-center justify-between rounded-2xl border p-4 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="border-border relative h-10 w-12 overflow-hidden rounded-lg border">
                            <Image src={item.imageSrc} alt="" fill className="object-cover" />
                          </div>
                          <div>
                            <h5 className="line-clamp-1 text-xs font-bold">{item.title}</h5>
                            <span className="text-brand text-[9px] font-bold tracking-wider uppercase">
                              {item.album}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteItem(item.id, "Gallery")}
                          className="cursor-pointer text-xs font-bold text-rose-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. VIDEOS CRUD */}
              {activeTab === "Videos" && (
                <div className="animate-in fade-in space-y-8 duration-200">
                  <form
                    onSubmit={handleSaveVideo}
                    className="bg-canvas-muted border-border space-y-4 rounded-3xl border p-6"
                  >
                    <h4 className="text-sm font-bold">
                      {editingId ? "Edit Video" : "Create New Video"}
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        name="title"
                        placeholder="Video Title"
                        value={formInputs.title}
                        onChange={handleInputChange}
                        className="bg-canvas border-border focus:border-brand w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none"
                        required
                      />
                      <input
                        type="text"
                        name="description"
                        placeholder="Video Description"
                        value={formInputs.description}
                        onChange={handleInputChange}
                        className="bg-canvas border-border focus:border-brand w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm" type="submit">
                        Save (D1 COMMIT)
                      </Button>
                    </div>
                  </form>

                  <div className="space-y-3">
                    {videos.map((item) => (
                      <div
                        key={item.id}
                        className="border-border bg-canvas hover:border-text-muted flex items-center justify-between rounded-2xl border p-4 transition-colors"
                      >
                        <div>
                          <h5 className="text-sm font-bold">{item.title}</h5>
                          <p className="text-text-muted mt-1 text-xs">{item.description}</p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => handleEditTrigger(item, "Videos")}
                            className="text-brand cursor-pointer text-xs font-bold hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, "Videos")}
                            className="cursor-pointer text-xs font-bold text-rose-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. DOWNLOADS CRUD */}
              {activeTab === "Downloads" && (
                <div className="animate-in fade-in space-y-8 duration-200">
                  <form
                    onSubmit={handleSaveDownload}
                    className="bg-canvas-muted border-border space-y-4 rounded-3xl border p-6"
                  >
                    <h4 className="text-sm font-bold">
                      {editingId ? "Edit Download" : "Create New Download"}
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        name="title"
                        placeholder="Download Title"
                        value={formInputs.title}
                        onChange={handleInputChange}
                        className="bg-canvas border-border focus:border-brand w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none"
                        required
                      />
                      <input
                        type="text"
                        name="description"
                        placeholder="File Description"
                        value={formInputs.description}
                        onChange={handleInputChange}
                        className="bg-canvas border-border focus:border-brand w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm" type="submit">
                        Save (D1 COMMIT)
                      </Button>
                    </div>
                  </form>

                  <div className="space-y-3">
                    {downloads.map((item) => (
                      <div
                        key={item.id}
                        className="border-border bg-canvas hover:border-text-muted flex items-center justify-between rounded-2xl border p-4 transition-colors"
                      >
                        <div>
                          <h5 className="text-sm font-bold">{item.title}</h5>
                          <p className="text-text-muted mt-1 text-xs">{item.description}</p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => handleEditTrigger(item, "Downloads")}
                            className="text-brand cursor-pointer text-xs font-bold hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, "Downloads")}
                            className="cursor-pointer text-xs font-bold text-rose-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. STUDENTS/SPOTLIGHT CRUD */}
              {activeTab === "Students" && (
                <div className="animate-in fade-in space-y-8 duration-200">
                  <form
                    onSubmit={handleSaveStudent}
                    className="bg-canvas-muted border-border space-y-4 rounded-3xl border p-6"
                  >
                    <h4 className="text-sm font-bold">
                      {editingId ? "Edit Student Profile" : "Create New Student Spotlight"}
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        name="name"
                        placeholder="Student Full Name"
                        value={formInputs.name}
                        onChange={handleInputChange}
                        className="bg-canvas border-border focus:border-brand w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none"
                        required
                      />
                      <input
                        type="text"
                        name="role"
                        placeholder="Role / Title"
                        value={formInputs.role}
                        onChange={handleInputChange}
                        className="bg-canvas border-border focus:border-brand w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm" type="submit">
                        Save (D1 COMMIT)
                      </Button>
                    </div>
                  </form>

                  <div className="space-y-3">
                    {students.map((item) => (
                      <div
                        key={item.id}
                        className="border-border bg-canvas hover:border-text-muted flex items-center justify-between rounded-2xl border p-4 transition-colors"
                      >
                        <div>
                          <h5 className="text-sm font-bold">{item.name}</h5>
                          <p className="text-text-muted mt-1 text-xs">{item.title}</p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => handleEditTrigger(item, "Students")}
                            className="text-brand cursor-pointer text-xs font-bold hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, "Students")}
                            className="cursor-pointer text-xs font-bold text-rose-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Status Terminal (SQL logs & R2 payloads logging panel) */}
            <div className="mt-12 rounded-3xl border border-neutral-800 bg-black p-6 text-left select-text">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="block font-mono text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                  Cloudflare Stack Telemetry Logs (D1 + R2)
                </span>
                <span className="h-2 w-2 animate-ping rounded-full bg-green-500" />
              </div>

              <div className="mt-4 max-h-[140px] space-y-2 overflow-y-auto font-mono text-[11px] leading-relaxed text-green-400">
                {telemetryLogs.map((log, logIdx) => {
                  let colorClass = "text-green-400";
                  if (log.startsWith("[D1 SQL]")) colorClass = "text-indigo-400";
                  if (log.startsWith("[R2 OBJECT]")) colorClass = "text-yellow-400";
                  if (log.startsWith("[AUTH]")) colorClass = "text-emerald-400";

                  return (
                    <div key={logIdx} className={colorClass}>
                      {log}
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
