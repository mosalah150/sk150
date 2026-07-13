"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { useDynamicData } from "@/providers/DynamicDataProvider";

type AdminTab = "Overview" | "Posts" | "Students" | "Events" | "Media" | "Downloads" | "Gallery" | "Menus" | "Homepage";

const tabLabels: Record<AdminTab, string> = {
  Overview: "ภาพรวมระบบ",
  Posts: "บันทึกบทความ (Posts)",
  Students: "ทำเนียบเพื่อน",
  Events: "กิจกรรมรุ่น",
  Media: "วิดีโอ & คลิปสั้น",
  Downloads: "เอกสารดาวน์โหลด",
  Gallery: "คลังสื่อรูปภาพ (R2/KV)",
  Menus: "จัดการเมนูนำทาง (Header)",
  Homepage: "ตั้งค่าหน้าแรก (Homepage)",
};

export default function AdminDashboardPage() {
  const { posts, students, events, media, downloads, gallery, menus, sections, refreshData } = useDynamicData();

  // Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tab Navigation
  const [activeTab, setActiveTab] = useState<AdminTab>("Overview");

  // Logs for D1/KV actions
  const [logs, setLogs] = useState<string[]>([
    `[SYSTEM] ระบบริเริ่มเชื่อมต่อ API เครือข่าย Cloudflare`,
    `[LOCAL] โหลดข้อมูลสแตติกสำรองสำเร็จ: ${posts.length} บทความ, ${students.length} นักเรียน`,
  ]);

  const addLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 49)]);
  };

  // Check login on mount
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token === "sk150password") {
      setIsLoggedIn(true);
      addLog("[AUTH] ลงชื่อเข้าใช้สำเร็จจากเซสชันเก่า (LocalStorage Token)");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const json = await res.json();
        localStorage.setItem("admin_token", json.token);
        setIsLoggedIn(true);
        addLog("[AUTH] ลงชื่อเข้าใช้ผ่านคลาวด์สำเร็จ: สิทธิ์แอดมินสูงสุด");
        refreshData();
      } else {
        setAuthError("รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
        addLog("[AUTH] ความพยายามเข้าสู่ระบบถูกปฏิเสธ: รหัสผ่านไม่ถูกต้อง");
      }
    } catch (err: any) {
      setAuthError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ Cloudflare ได้ (เข้าโหมดจำลอง?)");
      // Fallback auth for local testing without worker running
      if (password === "sk150password") {
        localStorage.setItem("admin_token", "sk150password");
        setIsLoggedIn(true);
        addLog("[AUTH] ลงชื่อเข้าใช้โหมดจำลองสำเร็จ (พัฒนาเว็บภายใน)");
      } else {
        setAuthError("รหัสผ่านไม่ถูกต้อง");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsLoggedIn(false);
    setActiveTab("Overview");
    addLog("[AUTH] ผู้ดูแลระบบออกจากระบบ.");
  };

  // Image Upload handler
  const [uploading, setUploading] = useState(false);
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    addLog(
      `[KV STORAGE] กำลังเริ่มอัปโหลดรูปภาพ: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
    );

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("admin_token") || "";

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        onComplete(json.url);
        addLog(`[KV STORAGE] อัปโหลดสำเร็จ! URL: ${json.url}`);

        // Insert uploaded image into gallery database tracker automatically
        const newGalleryItem = {
          id: `gal-${Date.now()}`,
          title: file.name.split(".")[0],
          description: `รูปภาพอัปโหลดแอดมิน: ${file.name}`,
          imageSrc: json.url,
          album: "เบื้องหลังกิจกรรม",
          aspectRatio: "video",
          location: "อัปโหลดทางคอมพิวเตอร์",
          date: new Date().toLocaleDateString("th-TH", { month: "long", year: "numeric" }),
        };

        await handleSaveData("gallery", newGalleryItem);
      } else {
        addLog("[ERROR] อัปโหลดไฟล์ล้มเหลว (คุณอาจไม่มีสิทธิ์แอดมินจริง)");
        alert("อัปโหลดล้มเหลว: กรุณาตรวจสอบสิทธิ์แอดมิน");
      }
    } catch (err: any) {
      addLog(`[ERROR] การเชื่อมต่ออัปโหลดผิดพลาด: ${err.message}`);
      // Simulated upload fallback for local dev
      const fakeUrl = `/assets/gallery_1.png`;
      onComplete(fakeUrl);
      addLog(`[DEV MODE] จำลองอัปโหลดสำเร็จ (Fallback): ${fakeUrl}`);
    } finally {
      setUploading(false);
    }
  };

  // Generic Save handler
  const handleSaveData = async (type: string, data: any) => {
    addLog(`[D1 SQL] กำลังบันทึกข้อมูลประเภท ${type} (ID: ${data.id})`);
    const token = localStorage.getItem("admin_token") || "";

    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, data }),
      });

      if (res.ok) {
        addLog(`[D1 SQL] บันทึกสำเร็จ! ตาราง: ${type}, แถว: ${data.id}`);
        refreshData();
        return true;
      } else {
        addLog(`[ERROR] บันทึกตาราง ${type} ล้มเหลว (401 Unauthorized?)`);
        alert("บันทึกไม่สำเร็จ: สิทธิ์เข้าถึงถูกปฏิเสธ");
        return false;
      }
    } catch (err: any) {
      addLog(`[ERROR] บันทึกลงฐานข้อมูลผิดพลาด: ${err.message}`);
      return false;
    }
  };

  // Form States for Editors
  const [postForm, setPostForm] = useState({
    id: "",
    slug: "",
    title: "",
    description: "",
    imageSrc: "",
    category: "วันแรกในโรงเรียน",
    tags: "",
    date: "",
    readTime: "อ่าน 5 นาที",
    publishedTime: "",
    authorName: "แอดมินรุ่น",
    authorAvatar: "/assets/spotlight.png",
    authorTitle: "คณะกรรมการรุ่น 150",
    content: "",
  });

  const [studentForm, setStudentForm] = useState({
    id: "",
    name: "",
    title: "",
    achievement: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    imageSrc: "",
    metrics: "", // JSON string or comma-separated label:value pairs
    bioParagraphs: "",
    highlightQuote: "",
  });

  const [eventForm, setEventForm] = useState({
    id: "",
    title: "",
    description: "",
    type: "upcoming", // upcoming or past
    date: "",
    time: "",
    location: "",
    locationType: "physical",
    countdownTarget: "",
    coverImage: "",
    galleryImages: "", // comma separated image URLs
    videoUrl: "",
    phase: "พบปะสังสรรค์",
  });

  const [mediaForm, setMediaForm] = useState({
    id: "",
    title: "",
    description: "",
    platform: "youtube",
    videoId: "",
    category: "ความทรงจำสั้นๆ",
    duration: "",
    date: "",
    coverImage: "",
  });

  const [downloadForm, setDownloadForm] = useState({
    id: "",
    title: "",
    description: "",
    category: "Documents",
    fileSize: "",
    fileExtension: "PDF",
    href: "",
  });

  const [menuForm, setMenuForm] = useState({
    id: "",
    label: "",
    href: "",
    sortOrder: 1,
  });

  const [sectionForm, setSectionForm] = useState({
    id: "",
    title: "",
    subtitle: "",
    hidden: 0,
    sortOrder: 1,
  });

  return (
    <div className="bg-canvas text-text flex-1 pb-24 transition-colors duration-200 select-none">
      {/* 1. Login Guard View */}
      {!isLoggedIn ? (
        <section className="flex min-h-[80vh] items-center justify-center py-20">
          <Container className="max-w-md">
            <div className="border-border bg-canvas-muted rounded-[32px] border p-8 text-center shadow-2xl">
              <div className="bg-brand/10 text-brand mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-black tracking-tight">ระบบแอดมินศิษย์เก่า SK150</h1>
              <p className="text-text-muted mt-2 text-sm leading-relaxed">
                กรุณาป้อนรหัสผ่านผู้ดูแลระบบหลังบ้านเพื่ออัปเดตบทความ รูปภาพแกลเลอรี และประวัติรุ่น
              </p>

              <form onSubmit={handleLogin} className="mt-8 space-y-4">
                <div>
                  <label className="text-text-muted block text-left text-xs font-bold tracking-wider uppercase">
                    รหัสผ่านแอดมิน (Admin Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="รหัสผ่านระบบหลังบ้าน..."
                    className="border-border bg-canvas text-text focus:ring-brand mt-2 w-full rounded-2xl border px-4 py-3.5 text-sm focus:ring-2 focus:outline-none"
                  />
                  {authError && (
                    <p className="mt-2 text-xs font-semibold text-rose-500">{authError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="bg-brand text-canvas hover:bg-brand/90 focus-visible:outline-brand flex w-full justify-center rounded-2xl py-3.5 text-sm font-bold transition-all disabled:opacity-40"
                >
                  {isLoggingIn ? "กำลังตรวจสอบระบบ..." : "เข้าสู่ระบบหลังบ้าน"}
                </button>
              </form>
            </div>
          </Container>
        </section>
      ) : (
        /* 2. Admin Workspace Dashboard */
        <section className="py-12">
          <Container clean className="max-w-[1400px] px-4">
            <div className="border-border mb-8 flex items-center justify-between border-b pb-6">
              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  แผงควบคุมระบบ CMS (WordPress-Style)
                </h1>
                <p className="text-text-muted mt-1 text-sm">
                  จัดการประวัติเพื่อนในทำเนียบรุ่น, วิดีโอความประทับใจ, กิจกรรม, คลังรูปถ่าย
                  และบทความ
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                ออกจากระบบ (Logout)
              </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
              {/* Left Column Sidebar */}
              <div className="lg:col-span-3">
                <nav className="border-border bg-canvas-muted space-y-2 rounded-[24px] border p-4">
                  {Object.keys(tabLabels).map((tabKey) => {
                    const isActive = activeTab === tabKey;
                    return (
                      <button
                        key={tabKey}
                        onClick={() => setActiveTab(tabKey as AdminTab)}
                        className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition-all ${
                          isActive
                            ? "bg-brand text-canvas"
                            : "text-text-muted hover:bg-canvas hover:text-text"
                        }`}
                      >
                        {tabLabels[tabKey as AdminTab]}
                      </button>
                    );
                  })}
                </nav>

                {/* Telemetry Logs Terminal */}
                <div className="border-border mt-6 rounded-[24px] border bg-black p-4 font-mono text-[10px] leading-relaxed text-emerald-400 shadow-inner">
                  <div className="mb-2 flex items-center justify-between border-b border-emerald-900 pb-2">
                    <span>TELEMETRY LOGS (D1/KV)</span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  </div>
                  <div className="h-44 scrollbar-none space-y-1.5 overflow-y-auto">
                    {logs.map((log, idx) => (
                      <div key={idx} className="break-all whitespace-pre-wrap">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Form Editors */}
              <div className="lg:col-span-9">
                {/* 1. OVERVIEW CONTROL PANEL */}
                {activeTab === "Overview" && (
                  <div className="border-border bg-canvas-muted space-y-8 rounded-[32px] border p-8">
                    <SectionHeader
                      title="ยินดีต้อนรับผู้ดูแลระบบ SK150"
                      subtitle="แผงควบคุมหลักสำหรับบริหารคลังความทรงจำประจำรุ่นและศิษย์เก่า"
                    />

                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                      {[
                        {
                          label: "ประวัติศิษย์เก่าใน D1",
                          val: students.length,
                          color: "text-indigo-500",
                        },
                        { label: "บันทึกบทความรุ่น", val: posts.length, color: "text-rose-500" },
                        { label: "กิจกรรมทั้งหมด", val: events.length, color: "text-amber-500" },
                        { label: "วิดีโอ & คลิปสั้น", val: media.length, color: "text-sky-500" },
                        {
                          label: "ไฟล์ในแกลเลอรี (KV)",
                          val: gallery.length,
                          color: "text-emerald-500",
                        },
                        {
                          label: "คลังไฟล์ดาวน์โหลด",
                          val: downloads.length,
                          color: "text-teal-500",
                        },
                      ].map((card, idx) => (
                        <div
                          key={idx}
                          className="bg-canvas border-border rounded-2xl border p-5 shadow-sm"
                        >
                          <span className={`block text-3xl font-black ${card.color}`}>
                            {card.val}
                          </span>
                          <span className="text-text-muted mt-1 block text-xs font-semibold">
                            {card.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-border text-text-muted border-t pt-6 text-sm leading-relaxed">
                      💡 **คำแนะนำผู้ใช้คนเดียว (Webmaster Guidelines)**:
                      คุณสามารถจัดการและเปลี่ยนรูปภาพได้ทันที เพียงไปที่แท็บ **"คลังสื่อรูปภาพ"**
                      เพื่อลากรูปภาพคอมพิวเตอร์ของคุณโยนขึ้นคลาวด์ ระบบจะมอบลิงก์รูปถ่าย (เช่น
                      `/api/media/filename.png`) ให้คุณก๊อปปี้ไปวางในบทความ
                      หรือประวัติเพื่อนร่วมชั้นเรียนได้สะดวกทันทีครับ!
                    </div>
                  </div>
                )}

                {/* 2. POSTS EDITOR (เขียนบทความ) */}
                {activeTab === "Posts" && (
                  <div className="border-border bg-canvas-muted space-y-8 rounded-[32px] border p-8">
                    <SectionHeader
                      title="เขียน & แก้ไขบันทึกความทรงจำ"
                      subtitle="เพิ่มบทความใหม่ หรือเลือกแก้ไขเรื่องราวประทับใจร่วมรุ่นลงบนเว็บไซต์หลัก"
                    />

                    {/* New Post Form */}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!postForm.id || !postForm.title || !postForm.slug) {
                          alert("กรุณากรอก ID, ชื่อเรื่อง และ Slug ลิงก์");
                          return;
                        }
                        const tagsArr = postForm.tags
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean);
                        const contentArr = postForm.content
                          .split("\n\n")
                          .map((c) => c.trim())
                          .filter(Boolean);

                        const success = await handleSaveData("posts", {
                          ...postForm,
                          tags: tagsArr,
                          content: contentArr,
                          publishedTime: postForm.publishedTime || new Date().toISOString(),
                        });

                        if (success) {
                          alert("บันทึกบทความสำเร็จ!");
                          setPostForm({
                            id: "",
                            slug: "",
                            title: "",
                            description: "",
                            imageSrc: "",
                            category: "วันแรกในโรงเรียน",
                            tags: "",
                            date: "",
                            readTime: "อ่าน 5 นาที",
                            publishedTime: "",
                            authorName: "แอดมินรุ่น",
                            authorAvatar: "/assets/spotlight.png",
                            authorTitle: "คณะกรรมการรุ่น 150",
                            content: "",
                          });
                        }
                      }}
                      className="bg-canvas border-border space-y-4 rounded-2xl border p-6"
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            ID บทความ (ห้ามซ้ำ เช่น post-5)
                          </label>
                          <input
                            type="text"
                            value={postForm.id}
                            onChange={(e) => setPostForm({ ...postForm, id: e.target.value })}
                            placeholder="ตัวอย่าง: post-5"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            ลิงก์บทความ (Slug - อังกฤษเท่านั้น เช่น my-class-trip)
                          </label>
                          <input
                            type="text"
                            value={postForm.slug}
                            onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })}
                            placeholder="ตัวอย่าง: trip-to-mountain"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            หัวข้อบทความ (ภาษาไทย)
                          </label>
                          <input
                            type="text"
                            value={postForm.title}
                            onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                            placeholder="ตัวอย่าง: ย้อนเวลาไปแคมป์วิทยาศาสตร์..."
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            หมวดหมู่บทความ
                          </label>
                          <select
                            value={postForm.category}
                            onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          >
                            <option value="วันแรกในโรงเรียน">วันแรกในโรงเรียน</option>
                            <option value="งานกีฬาสี">งานกีฬาสี</option>
                            <option value="ค่ายดนตรี">ค่ายดนตรี</option>
                            <option value="วันจบการศึกษา">วันจบการศึกษา</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            สรุปสั้นๆ (Description)
                          </label>
                          <input
                            type="text"
                            value={postForm.description}
                            onChange={(e) =>
                              setPostForm({ ...postForm, description: e.target.value })
                            }
                            placeholder="สรุปเรื่องราวประมาณ 1 ประโยค..."
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            รูปภาพหน้าปกบทความ (ก๊อปปี้มาจากคลังสื่อ/รูปที่มีอยู่)
                          </label>
                          <div className="mt-1.5 flex gap-2">
                            <input
                              type="text"
                              value={postForm.imageSrc}
                              onChange={(e) =>
                                setPostForm({ ...postForm, imageSrc: e.target.value })
                              }
                              placeholder="ตัวอย่าง: /api/media/filename.png"
                              className="border-border bg-canvas-muted text-text flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none"
                            />
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                disabled={uploading}
                                onChange={(e) =>
                                  handleImageUpload(e, (url) =>
                                    setPostForm({ ...postForm, imageSrc: url }),
                                  )
                                }
                                className="absolute inset-0 cursor-pointer opacity-0"
                              />
                              <button
                                type="button"
                                className="bg-text text-canvas h-full rounded-xl px-3 py-2.5 text-xs font-bold"
                              >
                                {uploading ? "กำลังโหลด..." : "อัปโหลดรูปปก"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            แท็กคำค้นหา (คั่นด้วยเครื่องหมายจุลภาค , )
                          </label>
                          <input
                            type="text"
                            value={postForm.tags}
                            onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })}
                            placeholder="ตัวอย่าง: กิจกรรมห้อง, ครูวิทย์, ประทับใจ"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            วันที่ลง / ระยะเวลาการอ่าน
                          </label>
                          <div className="mt-1.5 grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={postForm.date}
                              onChange={(e) => setPostForm({ ...postForm, date: e.target.value })}
                              placeholder="ตัวอย่าง: 13 กรกฎาคม 2026"
                              className="border-border bg-canvas-muted text-text w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                            />
                            <input
                              type="text"
                              value={postForm.readTime}
                              onChange={(e) =>
                                setPostForm({ ...postForm, readTime: e.target.value })
                              }
                              placeholder="ตัวอย่าง: อ่าน 4 นาที"
                              className="border-border bg-canvas-muted text-text w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-text-muted text-xs font-bold">
                          เนื้อหาบทความแบบยาว (แยกย่อหน้าใหม่โดยการกดปุ่ม Enter เว้นบรรทัด 2 ครั้ง)
                        </label>
                        <textarea
                          rows={6}
                          value={postForm.content}
                          onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                          placeholder="พิมพ์เล่าเรื่องราวความทรงจำของคุณที่นี่..."
                          className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() =>
                            setPostForm({
                              id: "",
                              slug: "",
                              title: "",
                              description: "",
                              imageSrc: "",
                              category: "วันแรกในโรงเรียน",
                              tags: "",
                              date: "",
                              readTime: "อ่าน 5 นาที",
                              publishedTime: "",
                              authorName: "แอดมินรุ่น",
                              authorAvatar: "/assets/spotlight.png",
                              authorTitle: "คณะกรรมการรุ่น 150",
                              content: "",
                            })
                          }
                          className="text-text-muted rounded-xl border px-4 py-2 text-xs font-bold"
                        >
                          ล้างแบบฟอร์ม
                        </button>
                        <button
                          type="submit"
                          className="bg-brand text-canvas rounded-xl px-6 py-2.5 text-xs font-bold"
                        >
                          บันทึกบทความขึ้นเว็บ
                        </button>
                      </div>
                    </form>

                    {/* Posts List */}
                    <div className="space-y-3">
                      <h4 className="text-text-muted text-sm font-bold">
                        บทความที่มีอยู่ทั้งหมด ({posts.length})
                      </h4>
                      <div className="border-border bg-canvas divide-y overflow-hidden rounded-2xl border">
                        {posts.map((post) => (
                          <div
                            key={post.id}
                            className="flex items-center justify-between gap-4 p-4"
                          >
                            <div>
                              <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-black text-rose-500 uppercase">
                                {post.category}
                              </span>
                              <h5 className="mt-1 text-sm font-bold">{post.title}</h5>
                              <p className="text-text-muted mt-0.5 text-xs">{post.description}</p>
                            </div>
                            <button
                              onClick={() => {
                                setPostForm({
                                  id: post.id,
                                  slug: post.slug,
                                  title: post.title,
                                  description: post.description,
                                  imageSrc: post.imageSrc,
                                  category: post.category,
                                  tags: post.tags.join(", "),
                                  date: post.date,
                                  readTime: post.readTime,
                                  publishedTime: post.publishedTime,
                                  authorName: post.author.name,
                                  authorAvatar: post.author.avatar,
                                  authorTitle: post.author.title,
                                  content: post.content.join("\n\n"),
                                });
                                addLog(`[FORM] ดึงข้อมูลบทความเพื่อแก้ไข: ${post.title}`);
                              }}
                              className="text-brand border-brand/20 rounded-lg border px-3 py-1.5 text-xs font-bold"
                            >
                              แก้ไข (Edit)
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. STUDENTS EDITOR (ทำเนียบเพื่อน) */}
                {activeTab === "Students" && (
                  <div className="border-border bg-canvas-muted space-y-8 rounded-[32px] border p-8">
                    <SectionHeader
                      title="จัดการทำเนียบเพื่อนร่วมรุ่น"
                      subtitle="เพิ่มหรือปรับปรุงประวัติ ช่องทางติดต่อ IG/TikTok และคำคมเพื่อนๆ ในรุ่น 150"
                    />

                    {/* Student Form */}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!studentForm.id || !studentForm.name) {
                          alert("กรุณากรอก ID และชื่อเล่นเพื่อนร่วมรุ่น");
                          return;
                        }

                        // Parse metrics
                        let metricsArr = [];
                        try {
                          metricsArr = studentForm.metrics
                            ? JSON.parse(studentForm.metrics)
                            : [
                                { label: "ระดับการเรียน", value: "GPA 4.00" },
                                { label: "ความเชี่ยวชาญ", value: "วิทยาศาสตร์" },
                              ];
                        } catch (e) {
                          metricsArr = studentForm.metrics
                            .split(",")
                            .map((item) => {
                              const [label, value] = item.split(":");
                              return { label: label?.trim(), value: value?.trim() };
                            })
                            .filter((m) => m.label && m.value);
                        }

                        // Parse bio paragraphs
                        const bioArr = studentForm.bioParagraphs
                          .split("\n\n")
                          .map((b) => b.trim())
                          .filter(Boolean);

                        const success = await handleSaveData("students", {
                          ...studentForm,
                          metrics: metricsArr,
                          bioParagraphs: bioArr,
                        });

                        if (success) {
                          alert("บันทึกประวัติสำเร็จ!");
                          setStudentForm({
                            id: "",
                            name: "",
                            title: "",
                            achievement: "",
                            instagram: "",
                            tiktok: "",
                            youtube: "",
                            imageSrc: "",
                            metrics: "",
                            bioParagraphs: "",
                            highlightQuote: "",
                          });
                        }
                      }}
                      className="bg-canvas border-border space-y-4 rounded-2xl border p-6"
                    >
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            ID ประวัตินักเรียน (ห้ามซ้ำ เช่น student-3)
                          </label>
                          <input
                            type="text"
                            value={studentForm.id}
                            onChange={(e) => setStudentForm({ ...studentForm, id: e.target.value })}
                            placeholder="ตัวอย่าง: student-3"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            ชื่อ-นามสกุลจริง (ชื่อเล่นในวงเล็บ)
                          </label>
                          <input
                            type="text"
                            value={studentForm.name}
                            onChange={(e) =>
                              setStudentForm({ ...studentForm, name: e.target.value })
                            }
                            placeholder="ตัวอย่าง: เมษา ศิริวัฒนา (เมย์)"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            ตำแหน่ง/บทบาทในรุ่น
                          </label>
                          <input
                            type="text"
                            value={studentForm.title}
                            onChange={(e) =>
                              setStudentForm({ ...studentForm, title: e.target.value })
                            }
                            placeholder="ตัวอย่าง: ประธานสภานักเรียน"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            ผลงานเด่น/ความสำเร็จ
                          </label>
                          <input
                            type="text"
                            value={studentForm.achievement}
                            onChange={(e) =>
                              setStudentForm({ ...studentForm, achievement: e.target.value })
                            }
                            placeholder="ตัวอย่าง: ชนะเลิศโครงงานคณิตศาสตร์..."
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            รูปโปรไฟล์เพื่อนร่วมรุ่น (ขนาด 1:1 หรือ 3:4)
                          </label>
                          <div className="mt-1.5 flex gap-2">
                            <input
                              type="text"
                              value={studentForm.imageSrc}
                              onChange={(e) =>
                                setStudentForm({ ...studentForm, imageSrc: e.target.value })
                              }
                              placeholder="/api/media/filename.png"
                              className="border-border bg-canvas-muted text-text flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none"
                            />
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                disabled={uploading}
                                onChange={(e) =>
                                  handleImageUpload(e, (url) =>
                                    setStudentForm({ ...studentForm, imageSrc: url }),
                                  )
                                }
                                className="absolute inset-0 cursor-pointer opacity-0"
                              />
                              <button
                                type="button"
                                className="bg-text text-canvas h-full rounded-xl px-3 py-2.5 text-xs font-bold"
                              >
                                {uploading ? "..." : "อัปโหลด"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            ลิงก์ Instagram
                          </label>
                          <input
                            type="text"
                            value={studentForm.instagram}
                            onChange={(e) =>
                              setStudentForm({ ...studentForm, instagram: e.target.value })
                            }
                            placeholder="ลิงก์ IG เต็ม..."
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">ลิงก์ TikTok</label>
                          <input
                            type="text"
                            value={studentForm.tiktok}
                            onChange={(e) =>
                              setStudentForm({ ...studentForm, tiktok: e.target.value })
                            }
                            placeholder="ลิงก์ TikTok เต็ม..."
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">ลิงก์ YouTube</label>
                          <input
                            type="text"
                            value={studentForm.youtube}
                            onChange={(e) =>
                              setStudentForm({ ...studentForm, youtube: e.target.value })
                            }
                            placeholder="ลิงก์ YouTube เต็ม..."
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            สถิติ/ตัวชี้วัดความชอบ (คั่นด้วยจุลภาค เช่น หัวข้อ:คะแนน)
                          </label>
                          <input
                            type="text"
                            value={studentForm.metrics}
                            onChange={(e) =>
                              setStudentForm({ ...studentForm, metrics: e.target.value })
                            }
                            placeholder="ตัวอย่าง: วิชาที่รัก:ฟิสิกส์, กิฟต์การ์ด:10,000"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            คำพูดประจำใจ / คำคม (Quotes)
                          </label>
                          <input
                            type="text"
                            value={studentForm.highlightQuote}
                            onChange={(e) =>
                              setStudentForm({ ...studentForm, highlightQuote: e.target.value })
                            }
                            placeholder="คำพูดติดตลก หรือคำคมเท่ๆ..."
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-text-muted text-xs font-bold">
                          ประวัตินักเรียนและเรื่องราวยาว (แยกย่อหน้าโดยการเว้นบรรทัด 2 ครั้ง)
                        </label>
                        <textarea
                          rows={4}
                          value={studentForm.bioParagraphs}
                          onChange={(e) =>
                            setStudentForm({ ...studentForm, bioParagraphs: e.target.value })
                          }
                          placeholder="เรื่องราวส่วนตัว ประสบการณ์ และความสำเร็จในโรงเรียน..."
                          className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() =>
                            setStudentForm({
                              id: "",
                              name: "",
                              title: "",
                              achievement: "",
                              instagram: "",
                              tiktok: "",
                              youtube: "",
                              imageSrc: "",
                              metrics: "",
                              bioParagraphs: "",
                              highlightQuote: "",
                            })
                          }
                          className="text-text-muted rounded-xl border px-4 py-2 text-xs font-bold"
                        >
                          ล้างแบบฟอร์ม
                        </button>
                        <button
                          type="submit"
                          className="bg-brand text-canvas rounded-xl px-6 py-2.5 text-xs font-bold"
                        >
                          บันทึกทำเนียบรุ่น
                        </button>
                      </div>
                    </form>

                    {/* Students list */}
                    <div className="space-y-3">
                      <h4 className="text-text-muted text-sm font-bold">
                        รายชื่อเพื่อนทั้งหมด ({students.length})
                      </h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {students.map((student) => (
                          <div
                            key={student.id}
                            className="border-border bg-canvas flex items-center justify-between gap-3 rounded-2xl border p-4 shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <div className="border-border relative h-12 w-12 overflow-hidden rounded-full border">
                                <Image
                                  src={student.imageSrc}
                                  alt={student.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <h5 className="text-sm font-bold">{student.name}</h5>
                                <p className="text-text-muted mt-0.5 text-xs">{student.title}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setStudentForm({
                                  id: student.id,
                                  name: student.name,
                                  title: student.title,
                                  achievement: student.achievement,
                                  instagram: student.instagram || "",
                                  tiktok: student.tiktok || "",
                                  youtube: student.youtube || "",
                                  imageSrc: student.imageSrc,
                                  metrics: JSON.stringify(student.metrics),
                                  bioParagraphs: student.bioParagraphs.join("\n\n"),
                                  highlightQuote: student.highlightQuote,
                                });
                                addLog(`[FORM] ดึงข้อมูลเพื่อนเพื่อแก้ไข: ${student.name}`);
                              }}
                              className="text-brand border-brand/20 rounded-lg border px-3 py-1.5 text-xs font-bold"
                            >
                              แก้ไข
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. EVENTS EDITOR (กิจกรรมรุ่น) */}
                {activeTab === "Events" && (
                  <div className="border-border bg-canvas-muted space-y-8 rounded-[32px] border p-8">
                    <SectionHeader
                      title="กิจกรรม & ตารางสังสรรค์ศิษย์เก่า"
                      subtitle="ตั้งกิจกรรมใหม่ ค่ายดนตรี งานคืนสู่เหย้า หรือแก้ไขสถานะเหตุการณ์"
                    />

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!eventForm.id || !eventForm.title) {
                          alert("กรุณากรอก ID และชื่อกิจกรรม");
                          return;
                        }
                        const gallArr = eventForm.galleryImages
                          .split(",")
                          .map((i) => i.trim())
                          .filter(Boolean);

                        const success = await handleSaveData("events", {
                          ...eventForm,
                          galleryImages: gallArr,
                        });

                        if (success) {
                          alert("บันทึกกิจกรรมเรียบร้อย!");
                          setEventForm({
                            id: "",
                            title: "",
                            description: "",
                            type: "upcoming",
                            date: "",
                            time: "",
                            location: "",
                            locationType: "physical",
                            countdownTarget: "",
                            coverImage: "",
                            galleryImages: "",
                            videoUrl: "",
                            phase: "พบปะสังสรรค์",
                          });
                        }
                      }}
                      className="bg-canvas border-border space-y-4 rounded-2xl border p-6"
                    >
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            ID กิจกรรม (ห้ามซ้ำ เช่น event-3)
                          </label>
                          <input
                            type="text"
                            value={eventForm.id}
                            onChange={(e) => setEventForm({ ...eventForm, id: e.target.value })}
                            placeholder="ตัวอย่าง: event-3"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            ชื่อหัวข้อกิจกรรม
                          </label>
                          <input
                            type="text"
                            value={eventForm.title}
                            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                            placeholder="ตัวอย่าง: เลี้ยงต้อนรับเพื่อนกลับไทย..."
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">ประเภทกิจกรรม</label>
                          <select
                            value={eventForm.type}
                            onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          >
                            <option value="upcoming">กิจกรรมที่กำลังจะเกิด (Upcoming)</option>
                            <option value="past">ผ่านพ้นไปแล้ว (Past Event)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            วันที่จัดงาน (ภาษาไทย)
                          </label>
                          <input
                            type="text"
                            value={eventForm.date}
                            onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                            placeholder="ตัวอย่าง: 24 กรกฎาคม 2026"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">เวลาจัดงาน</label>
                          <input
                            type="text"
                            value={eventForm.time}
                            onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                            placeholder="ตัวอย่าง: 18:00 น. เป็นต้นไป"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            หมวดหมู่/ประเภทสังสรรค์
                          </label>
                          <input
                            type="text"
                            value={eventForm.phase}
                            onChange={(e) => setEventForm({ ...eventForm, phase: e.target.value })}
                            placeholder="ตัวอย่าง: กิจกรรมศิษย์เก่า"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-text-muted text-xs font-bold">สถานที่จัดงาน</label>
                          <input
                            type="text"
                            value={eventForm.location}
                            onChange={(e) =>
                              setEventForm({ ...eventForm, location: e.target.value })
                            }
                            placeholder="ตัวอย่าง: หอประชุมโรงเรียน"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">รูปปกกิจกรรม</label>
                          <div className="mt-1.5 flex gap-2">
                            <input
                              type="text"
                              value={eventForm.coverImage}
                              onChange={(e) =>
                                setEventForm({ ...eventForm, coverImage: e.target.value })
                              }
                              placeholder="/api/media/filename.png"
                              className="border-border bg-canvas-muted text-text flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none"
                            />
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                disabled={uploading}
                                onChange={(e) =>
                                  handleImageUpload(e, (url) =>
                                    setEventForm({ ...eventForm, coverImage: url }),
                                  )
                                }
                                className="absolute inset-0 cursor-pointer opacity-0"
                              />
                              <button
                                type="button"
                                className="bg-text text-canvas h-full rounded-xl px-3 py-2.5 text-xs font-bold"
                              >
                                อัปโหลด
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="text-text-muted text-xs font-bold">รูปแบบพิกัด</label>
                          <select
                            value={eventForm.locationType}
                            onChange={(e) =>
                              setEventForm({ ...eventForm, locationType: e.target.value })
                            }
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          >
                            <option value="physical">จัดในพื้นที่จริง (Physical)</option>
                            <option value="virtual">จัดออนไลน์ (Virtual)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            เวลานับถอยหลัง (ISO target - สำหรับกิจกรรมใหม่)
                          </label>
                          <input
                            type="text"
                            value={eventForm.countdownTarget}
                            onChange={(e) =>
                              setEventForm({ ...eventForm, countdownTarget: e.target.value })
                            }
                            placeholder="ตัวอย่าง: 2026-07-24T18:00:00"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            รหัสยูทูปสรุปกิจกรรม (สำหรับงานอดีต)
                          </label>
                          <input
                            type="text"
                            value={eventForm.videoUrl}
                            onChange={(e) =>
                              setEventForm({ ...eventForm, videoUrl: e.target.value })
                            }
                            placeholder="ตัวอย่าง: dQw4w9WgXcQ"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-text-muted text-xs font-bold">
                          คลังอัลบั้มรูปย้อนหลัง (คั่นด้วยจุลภาค , )
                        </label>
                        <input
                          type="text"
                          value={eventForm.galleryImages}
                          onChange={(e) =>
                            setEventForm({ ...eventForm, galleryImages: e.target.value })
                          }
                          placeholder="/api/media/pic1.png, /api/media/pic2.png"
                          className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-text-muted text-xs font-bold">
                          คำอธิบายรายละเอียดงาน
                        </label>
                        <textarea
                          rows={3}
                          value={eventForm.description}
                          onChange={(e) =>
                            setEventForm({ ...eventForm, description: e.target.value })
                          }
                          placeholder="กำหนดการ กิจกรรม และรายละเอียดร่วมงาน..."
                          className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() =>
                            setEventForm({
                              id: "",
                              title: "",
                              description: "",
                              type: "upcoming",
                              date: "",
                              time: "",
                              location: "",
                              locationType: "physical",
                              countdownTarget: "",
                              coverImage: "",
                              galleryImages: "",
                              videoUrl: "",
                              phase: "พบปะสังสรรค์",
                            })
                          }
                          className="text-text-muted rounded-xl border px-4 py-2 text-xs font-bold"
                        >
                          ล้าง
                        </button>
                        <button
                          type="submit"
                          className="bg-brand text-canvas rounded-xl px-6 py-2.5 text-xs font-bold"
                        >
                          บันทึกกิจกรรม
                        </button>
                      </div>
                    </form>

                    {/* Events list */}
                    <div className="space-y-3">
                      <h4 className="text-text-muted text-sm font-bold">
                        กิจกรรมในระบบทั้งหมด ({events.length})
                      </h4>
                      <div className="border-border bg-canvas divide-y overflow-hidden rounded-2xl border">
                        {events.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center justify-between gap-4 p-4"
                          >
                            <div>
                              <span
                                className={`rounded px-2 py-0.5 text-[10px] font-black uppercase ${
                                  event.type === "upcoming"
                                    ? "bg-emerald-500/10 text-emerald-500"
                                    : "bg-neutral-500/10 text-neutral-500"
                                }`}
                              >
                                {event.type}
                              </span>
                              <h5 className="mt-1 text-sm font-bold">{event.title}</h5>
                              <p className="text-text-muted mt-0.5 text-xs">
                                {event.date} &bull; {event.location}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setEventForm({
                                  id: event.id,
                                  title: event.title,
                                  description: event.description,
                                  type: event.type,
                                  date: event.date,
                                  time: event.time,
                                  location: event.location,
                                  locationType: event.locationType,
                                  countdownTarget: event.countdownTarget || "",
                                  coverImage: event.coverImage,
                                  galleryImages: event.galleryImages.join(", "),
                                  videoUrl: event.videoUrl || "",
                                  phase: event.phase,
                                });
                                addLog(`[FORM] ดึงข้อมูลกิจกรรมเพื่อแก้ไข: ${event.title}`);
                              }}
                              className="text-brand border-brand/20 rounded-lg border px-3 py-1.5 text-xs font-bold"
                            >
                              แก้ไข
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. MEDIA EDITOR (วิดีโอเด่น) */}
                {activeTab === "Media" && (
                  <div className="border-border bg-canvas-muted space-y-8 rounded-[32px] border p-8">
                    <SectionHeader
                      title="วิดีโอ & คลิปสั้นความทรงจำ"
                      subtitle="แปะคลิป YouTube/TikTok กิจกรรม กีฬาสี หรือสัมภาษณ์ลงคลังสื่อวิดีโอ"
                    />

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!mediaForm.id || !mediaForm.title || !mediaForm.videoId) {
                          alert("กรุณากรอกข้อมูลวิดีโอให้ครบถ้วน");
                          return;
                        }

                        const success = await handleSaveData("media", mediaForm);
                        if (success) {
                          alert("บันทึกวิดีโอสำเร็จ!");
                          setMediaForm({
                            id: "",
                            title: "",
                            description: "",
                            platform: "youtube",
                            videoId: "",
                            category: "ความทรงจำสั้นๆ",
                            duration: "",
                            date: "",
                            coverImage: "",
                          });
                        }
                      }}
                      className="bg-canvas border-border space-y-4 rounded-2xl border p-6"
                    >
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            ID คลิปวิดีโอ (ห้ามซ้ำ เช่น video-4)
                          </label>
                          <input
                            type="text"
                            value={mediaForm.id}
                            onChange={(e) => setMediaForm({ ...mediaForm, id: e.target.value })}
                            placeholder="ตัวอย่าง: video-4"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            ชื่อเรื่องวิดีโอ
                          </label>
                          <input
                            type="text"
                            value={mediaForm.title}
                            onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                            placeholder="ตัวอย่าง: วิดีโอสรุปภาพประทับใจค่าย..."
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            ค่าย/แพลตฟอร์ม
                          </label>
                          <select
                            value={mediaForm.platform}
                            onChange={(e) =>
                              setMediaForm({
                                ...mediaForm,
                                platform: e.target.value as "youtube" | "tiktok",
                              })
                            }
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          >
                            <option value="youtube">YouTube</option>
                            <option value="tiktok">TikTok</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            รหัสวิดีโอ (Video ID เท่านั้น)
                          </label>
                          <input
                            type="text"
                            value={mediaForm.videoId}
                            onChange={(e) =>
                              setMediaForm({ ...mediaForm, videoId: e.target.value })
                            }
                            placeholder="ตัวอย่าง: dQw4w9WgXcQ"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            ความยาวคลิป (เช่น 12:45)
                          </label>
                          <input
                            type="text"
                            value={mediaForm.duration}
                            onChange={(e) =>
                              setMediaForm({ ...mediaForm, duration: e.target.value })
                            }
                            placeholder="ตัวอย่าง: 03:50"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            หมวดหมู่วิดีโอ
                          </label>
                          <select
                            value={mediaForm.category}
                            onChange={(e) =>
                              setMediaForm({ ...mediaForm, category: e.target.value })
                            }
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          >
                            <option value="งานจบการศึกษา">งานจบการศึกษา</option>
                            <option value="กีฬาสีและกิจกรรม">กีฬาสีและกิจกรรม</option>
                            <option value="แคมป์ปิ้งดนตรี">แคมป์ปิ้งดนตรี</option>
                            <option value="ความทรงจำสั้นๆ">ความทรงจำสั้นๆ</option>
                            <option value="กีฬาโรงเรียน">กีฬาโรงเรียน</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            วันที่ลงวิดีโอ
                          </label>
                          <input
                            type="text"
                            value={mediaForm.date}
                            onChange={(e) => setMediaForm({ ...mediaForm, date: e.target.value })}
                            placeholder="ตัวอย่าง: 13 กรกฎาคม 2026"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            รูปภาพหน้าปกวิดีโอ (Cover Image)
                          </label>
                          <div className="mt-1.5 flex gap-2">
                            <input
                              type="text"
                              value={mediaForm.coverImage}
                              onChange={(e) =>
                                setMediaForm({ ...mediaForm, coverImage: e.target.value })
                              }
                              placeholder="/api/media/cover.png"
                              className="border-border bg-canvas-muted text-text flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none"
                            />
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                disabled={uploading}
                                onChange={(e) =>
                                  handleImageUpload(e, (url) =>
                                    setMediaForm({ ...mediaForm, coverImage: url }),
                                  )
                                }
                                className="absolute inset-0 cursor-pointer opacity-0"
                              />
                              <button
                                type="button"
                                className="bg-text text-canvas h-full rounded-xl px-3 py-2.5 text-xs font-bold"
                              >
                                อัปโหลด
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-text-muted text-xs font-bold">คำอธิบายวิดีโอ</label>
                        <textarea
                          rows={2}
                          value={mediaForm.description}
                          onChange={(e) =>
                            setMediaForm({ ...mediaForm, description: e.target.value })
                          }
                          placeholder="เนื้อหาสำคัญของคลิปวิดีโอนี้..."
                          className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() =>
                            setMediaForm({
                              id: "",
                              title: "",
                              description: "",
                              platform: "youtube",
                              videoId: "",
                              category: "ความทรงจำสั้นๆ",
                              duration: "",
                              date: "",
                              coverImage: "",
                            })
                          }
                          className="text-text-muted rounded-xl border px-4 py-2 text-xs font-bold"
                        >
                          ล้าง
                        </button>
                        <button
                          type="submit"
                          className="bg-brand text-canvas rounded-xl px-6 py-2.5 text-xs font-bold"
                        >
                          บันทึกวิดีโอ
                        </button>
                      </div>
                    </form>

                    {/* Media list */}
                    <div className="space-y-3">
                      <h4 className="text-text-muted text-sm font-bold">
                        วิดีโอในคลังสื่อทั้งหมด ({media.length})
                      </h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {media.map((v) => (
                          <div
                            key={v.id}
                            className="border-border bg-canvas flex items-center justify-between gap-3 rounded-2xl border p-4 shadow-sm"
                          >
                            <div>
                              <span className="rounded bg-sky-500/10 px-2 py-0.5 text-[10px] font-black text-sky-500 uppercase">
                                {v.platform} &bull; {v.category}
                              </span>
                              <h5 className="mt-1 line-clamp-1 text-sm font-bold">{v.title}</h5>
                            </div>
                            <button
                              onClick={() => {
                                setMediaForm(v);
                                addLog(`[FORM] ดึงข้อมูลวิดีโอเพื่อแก้ไข: ${v.title}`);
                              }}
                              className="text-brand border-brand/20 rounded-lg border px-3 py-1.5 text-xs font-bold"
                            >
                              แก้ไข
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. DOWNLOADS EDITOR (เอกสารดาวน์โหลด) */}
                {activeTab === "Downloads" && (
                  <div className="border-border bg-canvas-muted space-y-8 rounded-[32px] border p-8">
                    <SectionHeader
                      title="คลังไฟล์ & เอกสารประจำรุ่น"
                      subtitle="อัปโหลดหนังสือรุ่นฉบับย่อ ไฟล์คู่มือ หรือภาพพื้นหลังความละเอียดสูง"
                    />

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!downloadForm.id || !downloadForm.title) {
                          alert("กรุณากรอก ID และชื่อไฟล์ให้ครบถ้วน");
                          return;
                        }

                        const success = await handleSaveData("downloads", downloadForm);
                        if (success) {
                          alert("บันทึกไฟล์ดาวน์โหลดสำเร็จ!");
                          setDownloadForm({
                            id: "",
                            title: "",
                            description: "",
                            category: "Documents",
                            fileSize: "",
                            fileExtension: "PDF",
                            href: "",
                          });
                        }
                      }}
                      className="bg-canvas border-border space-y-4 rounded-2xl border p-6"
                    >
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            ID ไฟล์ (ห้ามซ้ำ เช่น file-5)
                          </label>
                          <input
                            type="text"
                            value={downloadForm.id}
                            onChange={(e) =>
                              setDownloadForm({ ...downloadForm, id: e.target.value })
                            }
                            placeholder="ตัวอย่าง: file-5"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            ชื่อไฟล์ภาษาไทย
                          </label>
                          <input
                            type="text"
                            value={downloadForm.title}
                            onChange={(e) =>
                              setDownloadForm({ ...downloadForm, title: e.target.value })
                            }
                            placeholder="ตัวอย่าง: ตราสัญลักษณ์เวกเตอร์..."
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            หมวดหมู่เอกสาร
                          </label>
                          <select
                            value={downloadForm.category}
                            onChange={(e) =>
                              setDownloadForm({ ...downloadForm, category: e.target.value })
                            }
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          >
                            <option value="PDF">เอกสาร PDF</option>
                            <option value="Wallpaper">ภาพพื้นหลัง</option>
                            <option value="Logo">ตราสัญลักษณ์</option>
                            <option value="Documents">เอกสารรุ่น</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            ขนาดไฟล์ (เช่น 12.5 MB)
                          </label>
                          <input
                            type="text"
                            value={downloadForm.fileSize}
                            onChange={(e) =>
                              setDownloadForm({ ...downloadForm, fileSize: e.target.value })
                            }
                            placeholder="ตัวอย่าง: 4.8 MB"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            นามสกุลไฟล์ (เช่น PDF, PNG, SVG)
                          </label>
                          <input
                            type="text"
                            value={downloadForm.fileExtension}
                            onChange={(e) =>
                              setDownloadForm({ ...downloadForm, fileExtension: e.target.value })
                            }
                            placeholder="ตัวอย่าง: PDF"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">
                            ที่อยู่ดาวน์โหลด (Link หรือ อัปโหลดตรง)
                          </label>
                          <div className="mt-1.5 flex gap-2">
                            <input
                              type="text"
                              value={downloadForm.href}
                              onChange={(e) =>
                                setDownloadForm({ ...downloadForm, href: e.target.value })
                              }
                              placeholder="ลิงก์ดาวน์โหลด..."
                              className="border-border bg-canvas-muted text-text flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none"
                            />
                            <div className="relative">
                              <input
                                type="file"
                                disabled={uploading}
                                onChange={(e) =>
                                  handleImageUpload(e, (url) =>
                                    setDownloadForm({ ...downloadForm, href: url }),
                                  )
                                }
                                className="absolute inset-0 cursor-pointer opacity-0"
                              />
                              <button
                                type="button"
                                className="bg-text text-canvas h-full rounded-xl px-3 py-2.5 text-xs font-bold"
                              >
                                อัปโหลด
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-text-muted text-xs font-bold">
                          คำอธิบายรายละเอียดเอกสาร
                        </label>
                        <textarea
                          rows={2}
                          value={downloadForm.description}
                          onChange={(e) =>
                            setDownloadForm({ ...downloadForm, description: e.target.value })
                          }
                          placeholder="รายละเอียด วิธีการเปิด หรือการนำเอกสารไปใช้งาน..."
                          className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() =>
                            setDownloadForm({
                              id: "",
                              title: "",
                              description: "",
                              category: "Documents",
                              fileSize: "",
                              fileExtension: "PDF",
                              href: "",
                            })
                          }
                          className="text-text-muted rounded-xl border px-4 py-2 text-xs font-bold"
                        >
                          ล้าง
                        </button>
                        <button
                          type="submit"
                          className="bg-brand text-canvas rounded-xl px-6 py-2.5 text-xs font-bold"
                        >
                          บันทึกไฟล์ดาวน์โหลด
                        </button>
                      </div>
                    </form>

                    {/* Downloads List */}
                    <div className="space-y-3">
                      <h4 className="text-text-muted text-sm font-bold">
                        เอกสารที่มีอยู่ทั้งหมด ({downloads.length})
                      </h4>
                      <div className="border-border bg-canvas divide-y overflow-hidden rounded-2xl border">
                        {downloads.map((d) => (
                          <div key={d.id} className="flex items-center justify-between gap-4 p-4">
                            <div>
                              <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-black text-rose-500 uppercase">
                                {d.fileExtension} &bull; {d.category}
                              </span>
                              <h5 className="mt-1 text-sm font-bold">{d.title}</h5>
                              <p className="text-text-muted mt-0.5 text-xs">{d.fileSize}</p>
                            </div>
                            <button
                              onClick={() => {
                                setDownloadForm(d);
                                addLog(`[FORM] ดึงข้อมูลไฟล์ดาวน์โหลดเพื่อแก้ไข: ${d.title}`);
                              }}
                              className="text-brand border-brand/20 rounded-lg border px-3 py-1.5 text-xs font-bold"
                            >
                              แก้ไข
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. GALLERY MEDIA LIBRARY (คลังรูปภาพหลัก) */}
                {activeTab === "Gallery" && (
                  <div className="border-border bg-canvas-muted space-y-8 rounded-[32px] border p-8">
                    <SectionHeader
                      title="คลังรูปภาพแบบมีเดียแล็บ (Media Library)"
                      subtitle="ลากรูปภาพมาวางหรือเลือกไฟล์ภาพประกอบจากคอมพิวเตอร์เพื่อโยนขึ้นคลาวด์รับที่อยู่ลิงก์อ้างอิง"
                    />

                    {/* Drag & Drop uploader zone */}
                    <div className="border-border hover:border-brand bg-canvas relative rounded-2xl border-2 border-dashed p-12 text-center transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        onChange={(e) => handleImageUpload(e, () => {})}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-brand/10 text-brand flex h-12 w-12 items-center justify-center rounded-full">
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <span className="text-text text-sm font-bold">
                          {uploading
                            ? "กำลังอัปโหลดไฟล์เข้าระบบ..."
                            : "คลิกเลือกรูปภาพ หรือลากไฟล์ภาพมาปล่อยที่นี่"}
                        </span>
                        <span className="text-text-muted text-xs">
                          รูปจะถูกส่งเข้าระบบจัดเก็บข้อมูลของ Cloudflare ทันที
                        </span>
                      </div>
                    </div>

                    {/* Grid of uploaded images in KV */}
                    <div className="space-y-3">
                      <h4 className="text-text-muted text-sm font-bold">
                        รูปภาพทั้งหมดในระบบคลาวด์ ({gallery.length})
                      </h4>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {gallery.map((img) => (
                          <div
                            key={img.id}
                            className="border-border bg-canvas group overflow-hidden rounded-2xl border shadow-sm"
                          >
                            <div className="border-border relative aspect-video w-full overflow-hidden border-b bg-black/5">
                              <Image
                                src={img.imageSrc}
                                alt={img.title}
                                fill
                                className="object-cover"
                                sizes="200px"
                              />
                            </div>
                            <div className="p-3">
                              <h5 className="line-clamp-1 text-xs font-bold">{img.title}</h5>
                              <p className="text-text-muted mt-0.5 line-clamp-1 text-[10px]">
                                {img.imageSrc}
                              </p>

                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(img.imageSrc);
                                  alert(`คัดลอกลิงก์สำเร็จ:\n${img.imageSrc}`);
                                  addLog(`[CLIPBOARD] คัดลอกลิงก์รูปสำเร็จ: ${img.imageSrc}`);
                                }}
                                className="bg-brand/5 border-brand/10 text-brand mt-3 w-full rounded-lg border py-1.5 text-[10px] font-bold transition-all active:scale-95"
                              >
                                ก๊อปปี้ลิงก์รูป
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. MENUS EDITOR (เมนูนำทาง) */}
                {activeTab === "Menus" && (
                  <div className="border-border bg-canvas-muted space-y-8 rounded-[32px] border p-8">
                    <SectionHeader
                      title="ปรับแต่งเมนูนำทางบนเว็บหลัก"
                      subtitle="เพิ่ม ลบ แก้ไขชื่อ หรือสลับลำดับการแสดงผลของเมนูหลักบนแถบเมนูด้านบน (Header)"
                    />

                    {/* Menu Form */}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!menuForm.id || !menuForm.label || !menuForm.href) {
                          alert("กรุณากรอกข้อมูลให้ครบถ้วน");
                          return;
                        }

                        const success = await handleSaveData("menus", menuForm);
                        if (success) {
                          alert("บันทึกเมนูสำเร็จ!");
                          setMenuForm({
                            id: "",
                            label: "",
                            href: "",
                            sortOrder: 1,
                          });
                        }
                      }}
                      className="bg-canvas border-border rounded-2xl border p-6 space-y-4"
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-text-muted text-xs font-bold">ID เมนู (ห้ามซ้ำ เช่น menu-7)</label>
                          <input
                            type="text"
                            value={menuForm.id}
                            onChange={(e) => setMenuForm({ ...menuForm, id: e.target.value })}
                            placeholder="ตัวอย่าง: menu-7"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">ลำดับเมนู (ตัวเลขน้อยอยู่ซ้าย)</label>
                          <input
                            type="number"
                            value={menuForm.sortOrder}
                            onChange={(e) => setMenuForm({ ...menuForm, sortOrder: Number(e.target.value) })}
                            placeholder="ตัวอย่าง: 7"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-text-muted text-xs font-bold">ชื่อเมนูนำทาง (ภาษาไทย)</label>
                          <input
                            type="text"
                            value={menuForm.label}
                            onChange={(e) => setMenuForm({ ...menuForm, label: e.target.value })}
                            placeholder="ตัวอย่าง: ช่องทางติดต่อ"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">ลิงก์ปลายทาง (เช่น /contact หรือลิงก์ภายนอก)</label>
                          <input
                            type="text"
                            value={menuForm.href}
                            onChange={(e) => setMenuForm({ ...menuForm, href: e.target.value })}
                            placeholder="ตัวอย่าง: /downloads"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() =>
                            setMenuForm({
                              id: "",
                              label: "",
                              href: "",
                              sortOrder: 1,
                            })
                          }
                          className="text-text-muted border rounded-xl px-4 py-2 text-xs font-bold"
                        >
                          ล้างฟอร์ม
                        </button>
                        <button
                          type="submit"
                          className="bg-brand text-canvas rounded-xl px-6 py-2.5 text-xs font-bold"
                        >
                          บันทึกเมนู
                        </button>
                      </div>
                    </form>

                    {/* Menus List */}
                    <div className="space-y-3">
                      <h4 className="text-text-muted text-sm font-bold">เมนูนำทางในระบบทั้งหมด ({menus.length})</h4>
                      <div className="divide-y border border-border rounded-2xl bg-canvas overflow-hidden">
                        {menus.map((item) => (
                          <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                            <div>
                              <span className="bg-brand/10 text-brand text-[10px] font-black px-2 py-0.5 rounded">ลำดับ: {item.sortOrder}</span>
                              <h5 className="font-bold text-sm mt-1">{item.label}</h5>
                              <p className="text-xs text-text-muted mt-0.5">ลิงก์: {item.href}</p>
                            </div>
                            <button
                              onClick={() => {
                                setMenuForm({
                                  id: item.id,
                                  label: item.label,
                                  href: item.href,
                                  sortOrder: item.sortOrder,
                                });
                                addLog(`[FORM] ดึงข้อมูลเมนูเพื่อแก้ไข: ${item.label}`);
                              }}
                              className="text-brand text-xs font-bold border border-brand/20 px-3 py-1.5 rounded-lg"
                            >
                              แก้ไข
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. HOMEPAGE SECTIONS EDITOR (ตั้งค่าหน้าแรก) */}
                {activeTab === "Homepage" && (
                  <div className="border-border bg-canvas-muted space-y-8 rounded-[32px] border p-8">
                    <SectionHeader
                      title="ตั้งค่า & ปรับแต่งการแสดงผลหน้าแรก (Homepage Settings)"
                      subtitle="แก้ไขชื่อเซกชัน, คำอธิบายย่อย, ลำดับการเรียงหน้า หรือ ซ่อน/แสดง (Hiding) แต่ละเซกชันในหน้าแรกของเว็บได้ทันที"
                    />

                    {/* Section Form */}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!sectionForm.id || !sectionForm.title) {
                          alert("กรุณากรอกข้อมูลให้ครบถ้วน");
                          return;
                        }

                        const success = await handleSaveData("homepage_sections", sectionForm);
                        if (success) {
                          alert("บันทึกการตั้งค่าหน้าแรกสำเร็จ!");
                          setSectionForm({
                            id: "",
                            title: "",
                            subtitle: "",
                            hidden: 0,
                            sortOrder: 1,
                          });
                        }
                      }}
                      className="bg-canvas border-border rounded-2xl border p-6 space-y-4"
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-text-muted text-xs font-bold">ชื่อรหัสเซกชัน (ห้ามแก้ไขใหม่ - ดึงมาแก้ไขเท่านั้น)</label>
                          <input
                            type="text"
                            disabled
                            value={sectionForm.id}
                            placeholder="เลือกแก้ไขจากตารางด้านล่าง..."
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none opacity-60"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">ลำดับการแสดงผล (เรียงจากน้อยไปมาก)</label>
                          <input
                            type="number"
                            value={sectionForm.sortOrder}
                            onChange={(e) => setSectionForm({ ...sectionForm, sortOrder: Number(e.target.value) })}
                            placeholder="ตัวอย่าง: 1"
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-text-muted text-xs font-bold">ชื่อหลักของเซกชัน (Title)</label>
                          <input
                            type="text"
                            value={sectionForm.title}
                            onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                            placeholder="ตัวอย่าง: บันทึกความทรงจำ..."
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-text-muted text-xs font-bold">คำอธิบายย่อยของเซกชัน (Subtitle)</label>
                          <input
                            type="text"
                            value={sectionForm.subtitle}
                            onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })}
                            placeholder="ตัวอย่าง: เรื่องราว ภาพถ่าย และความประทับใจ..."
                            className="border-border bg-canvas-muted text-text mt-1.5 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Hiding Toggle Button */}
                      <div className="bg-canvas-muted border border-border rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold">ซ่อนส่วนแสดงผลนี้ (Hiding Section Toggle)</h4>
                          <p className="text-xs text-text-muted mt-1">ทำเครื่องหมายที่นี่หากคุณต้องการซ่อนเซกชันนี้ชั่วคราวไม่ให้แสดงบนหน้าแรกของเว็บ</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={sectionForm.hidden === 1}
                            onChange={(e) => setSectionForm({ ...sectionForm, hidden: e.target.checked ? 1 : 0 })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                        </label>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSectionForm({
                              id: "",
                              title: "",
                              subtitle: "",
                              hidden: 0,
                              sortOrder: 1,
                            })
                          }
                          className="text-text-muted border rounded-xl px-4 py-2 text-xs font-bold"
                        >
                          ล้างฟอร์ม
                        </button>
                        <button
                          type="submit"
                          className="bg-brand text-canvas rounded-xl px-6 py-2.5 text-xs font-bold"
                        >
                          บันทึกการตั้งค่า
                        </button>
                      </div>
                    </form>

                    {/* Sections list in D1 */}
                    <div className="space-y-3">
                      <h4 className="text-text-muted text-sm font-bold">เซกชันทั้งหมดในหน้าแรก ({sections.length})</h4>
                      <div className="divide-y border border-border rounded-2xl bg-canvas overflow-hidden">
                        {sections.map((item) => (
                          <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                            <div>
                              <div className="flex gap-2">
                                <span className="bg-brand/10 text-brand text-[10px] font-black px-2 py-0.5 rounded">ลำดับ: {item.sortOrder}</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                                  item.hidden === 1 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                                }`}>
                                  {item.hidden === 1 ? "ซ่อนอยู่ (Hidden)" : "แสดงผลปกติ (Visible)"}
                                </span>
                              </div>
                              <h5 className="font-bold text-sm mt-1">{item.title} <span className="text-xs text-text-muted">({item.id})</span></h5>
                              <p className="text-xs text-text-muted mt-0.5">{item.subtitle}</p>
                            </div>
                            <button
                              onClick={() => {
                                setSectionForm({
                                  id: item.id,
                                  title: item.title,
                                  subtitle: item.subtitle,
                                  hidden: item.hidden,
                                  sortOrder: item.sortOrder,
                                });
                                addLog(`[FORM] ดึงข้อมูลเซกชันเพื่อแก้ไข: ${item.title}`);
                              }}
                              className="text-brand text-xs font-bold border border-brand/20 px-3 py-1.5 rounded-lg"
                            >
                              แก้ไข
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
