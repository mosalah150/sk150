"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useDynamicData } from "@/providers/DynamicDataProvider";

export default function Home() {
  const breadcrumbItems = [{ label: "หน้าแรก", href: "/" }, { label: "ภาพรวมโครงการ" }];
  const { posts, events, media, students, gallery } = useDynamicData();

  // Pick top items
  const spotlightStudent = students[0] || {
    id: "student-1",
    name: "เมษา ศิริวัฒนา (เมย์)",
    title: "ประธานรุ่น & ประธานสภานักเรียน รุ่น 150",
    imageSrc: "/assets/spotlight.png",
    highlightQuote:
      "การทำทำเนียบรุ่นและหนังสือรุ่นครั้งนี้เป็นความร่วมมือร่วมใจของพวกเราทุกคน การพัฒนาหน้าเว็บนี้ทำให้เพื่อนๆ สามารถกลับมาเชื่อมต่อ ค้นหา และช่วยเหลือกันได้เสมอ ไม่ว่าหลังจากนี้พวกเราจะแยกย้ายไปทำอะไรที่ไหนในโลกก็ตาม",
    achievement:
      "เมย์ทำหน้าที่คอยประสานงานกิจกรรมรุ่นตลอดมัธยมศึกษาตอนปลาย และเป็นหัวเรือใหญ่รวบรวมรูปภาพบันทึกความทรงจำ ตั้งแต่งานกีฬาสี ค่ายทัศนศึกษา จนถึงนาทีจบการศึกษาปัจฉิมนิเทศ",
    bioParagraphs: [],
    instagram: "",
    tiktok: "",
    youtube: "",
    metrics: [],
  };

  const topPosts = posts.slice(0, 3);
  const upcomingEvents = events.filter((e) => e.type === "upcoming").slice(0, 2);
  const topGallery = gallery.slice(0, 3);
  const topVideos = media.slice(0, 3);

  // Map bento classes
  const getBentoClass = (idx: number) => {
    if (idx === 0) return "md:col-span-2";
    if (idx === 1) return "md:col-span-1";
    return "md:col-span-3";
  };

  const getBentoAspect = (idx: number) => {
    if (idx === 0 || idx === 2) return "wide";
    return "portrait";
  };

  return (
    <main
      id="content"
      tabIndex={-1}
      className="bg-canvas text-text focus-visible:outline-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {/* Breadcrumb Area */}
      <Container className="pt-6 pb-2">
        <Breadcrumb items={breadcrumbItems} />
      </Container>

      {/* 1. Hero Section */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden py-24 sm:py-32">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/hero_bg.png"
            alt="Sleek abstract technology background"
            fill
            priority
            fetchPriority="high"
            className="object-cover opacity-60 dark:opacity-40"
            sizes="100vw"
          />
          {/* Subtle dark overlays */}
          <div className="from-canvas/95 via-canvas/40 absolute inset-0 bg-gradient-to-r to-transparent" />
        </div>

        <Container className="relative z-10 w-full">
          <div className="max-w-3xl">
            <div className="border-brand/20 bg-brand/5 text-brand mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
              ทำเนียบรุ่นศิษย์เก่า &bull; รุ่น 150
            </div>
            <h1 className="text-text text-5xl leading-[1.05] font-black tracking-tighter uppercase sm:text-6xl md:text-7xl lg:text-8xl">
              รุ่น <span className="bg-gradient-to-r from-brand to-brand-secondary bg-clip-text text-transparent">150</span>.<br />
              เรื่องราวของเรา.
            </h1>
            <p className="text-text-muted mt-6 max-w-xl text-lg leading-relaxed font-normal sm:text-xl">
              ร่วมระลึกถึงการเดินทาง มิตรภาพเพื่อนร่วมชั้นเรียน และความทรงจำอันล้ำค่าในรั้วโรงเรียน
              ทำเนียบรุ่นดิจิทัลสำหรับนักเรียนรุ่น 150
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/spotlight">
                <Button variant="primary" size="lg">
                  ค้นหาเพื่อนร่วมรุ่น
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  เกี่ยวกับพวกเรา
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Minimal Portal Navigation Grid */}
      <section className="border-border border-t border-b bg-canvas-muted/50 py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "คลังภาพความทรงจำ",
                desc: "รวบรวมรูปภาพกิจกรรมประทับใจ วันเรียน และแกลเลอรีภาพถ่ายรุ่น",
                link: "/gallery",
                color: "from-brand/10 to-brand/5",
                actionText: "เปิดคลังรูปถ่าย",
              },
              {
                title: "บทความ & เรื่องราวดีๆ",
                desc: "อ่านไดอารี่ บันทึกความทรงจำ และเรื่องราวพิเศษของพวกเรา",
                link: "/stories",
                color: "from-canvas to-canvas-muted",
                actionText: "อ่านเรื่องราวรุ่น",
              },
              {
                title: "วิดีโอ & คลิปสั้น",
                desc: "เทปบันทึกกิจกรรมค่ายดนตรี กีฬาสี และคลิปความสนุกสนานย้อนหลัง",
                link: "/media",
                color: "from-brand-secondary/10 to-brand-secondary/5",
                actionText: "ชมวิดีโอดีๆ",
              },
            ].map((portal, idx) => (
              <Link
                key={idx}
                href={portal.link}
                className="border-border hover:border-text-muted bg-canvas group flex flex-col justify-between rounded-3xl border p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div>
                  <h3 className="text-xl font-bold tracking-tight">{portal.title}</h3>
                  <p className="text-text-muted mt-2 text-sm leading-relaxed">{portal.desc}</p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-xs font-bold tracking-wide uppercase text-brand group-hover:text-brand-secondary transition-colors">
                  <span>{portal.actionText}</span>
                  <svg
                    className="h-4 w-4 transform transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Spotlight Banner */}
      <section id="spotlight" className="py-24 sm:py-32">
        <Container>
          <div className="border-border bg-canvas-muted rounded-[32px] border p-8 sm:p-12 md:p-16">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <span className="bg-brand/10 border-brand/20 text-brand rounded-full border px-3.5 py-1 text-xs font-bold tracking-wider uppercase">
                  นักเรียนเด่นประจำรุ่น
                </span>
                <h2 className="text-text mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                  {spotlightStudent.name}
                </h2>
                <p className="text-brand text-sm font-semibold mt-2">{spotlightStudent.title}</p>
                <p className="text-text-muted mt-6 text-base leading-relaxed">
                  {spotlightStudent.achievement || spotlightStudent.bioParagraphs[0]}
                </p>
                <div className="mt-8">
                  <Link href="/spotlight">
                    <Button variant="outline" size="sm">
                      อ่านประวัติสัมภาษณ์เพิ่มเติม
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border shadow-lg">
                <Image
                  src={spotlightStudent.imageSrc}
                  alt={spotlightStudent.name}
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Class Memories Section */}
      <section id="stories" className="border-border border-t py-24 sm:py-32 bg-canvas-muted/30">
        <Container>
          <SectionHeader
            title="บันทึกความทรงจำ"
            subtitle="เรื่องราว ภาพถ่าย และบันทึกเหตุการณ์ประทับใจในช่วงเรียนร่วมรุ่นกันของพวกเรา"
            ctaText="อ่านเรื่องราวทั้งหมด"
            ctaHref="/stories"
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {topPosts.map((post) => (
              <Card
                key={post.id}
                title={post.title}
                description={post.description}
                date={post.date}
                readTime={post.readTime}
                badge={post.category}
                href={`/stories/${post.slug}`}
                aspectRatio="video"
              />
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Featured Gallery (Bento Style) */}
      <section id="gallery" className="py-24 sm:py-32">
        <Container>
          <SectionHeader
            title="ภาพความทรงจำประทับใจ"
            subtitle="รวบรวมภาพบันทึกจังหวะชีวิตกิจกรรม วัยเรียน และความร่วมมือในผลงานรุ่นต่างๆ"
            ctaText="เปิดคลังภาพทั้งหมด"
            ctaHref="/gallery"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {topGallery.map((item, idx) => (
              <Card
                key={item.id}
                title={item.title}
                description={item.description}
                imageSrc={item.imageSrc}
                imageAlt={item.title}
                badge={item.album}
                aspectRatio={getBentoAspect(idx)}
                className={getBentoClass(idx)}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* 6. Latest Videos Section */}
      <section
        id="videos"
        className="bg-canvas-muted/40 border-border border-t border-b py-24 sm:py-32"
      >
        <Container>
          <SectionHeader
            title="วิดีโอเด่นความทรงจำ"
            subtitle="บันทึกเทปงานพิธีสำคัญ ไฮไลท์กิจกรรมโรงเรียน และสารคดีประมวลผลงานของรุ่น"
            ctaText="ดูวิดีโอทั้งหมด"
            ctaHref="/media"
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {topVideos.map((video) => (
              <div
                key={video.id}
                className="border-border bg-canvas group hover:border-text-muted flex flex-col overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-neutral-900">
                  <Image
                    src={video.coverImage}
                    alt={video.title}
                    fill
                    loading="lazy"
                    className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="bg-canvas/90 border-border text-text flex h-14 w-14 items-center justify-center rounded-full border shadow-md backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                      <svg className="ml-1 h-6 w-6 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <span className="absolute right-4 bottom-4 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                    {video.duration}
                  </span>
                </div>
                <div className="p-6">
                  <span className="text-brand text-xs font-semibold tracking-wider uppercase">
                    {video.category}
                  </span>
                  <h4 className="text-text mt-1 line-clamp-2 text-lg font-bold">{video.title}</h4>
                  <p className="text-text-muted mt-2 line-clamp-2 text-sm">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 7. Upcoming Events Section */}
      <section id="events" className="py-24 sm:py-32">
        <Container>
          <SectionHeader
            title="กิจกรรมของรุ่น"
            subtitle="พบปะพูดคุยและสร้างสรรค์กิจกรรมดีๆ ร่วมกันระหว่างเพื่อนร่วมชั้นเรียน"
            ctaText="ดูกิจกรรมทั้งหมด"
            ctaHref="/events"
          />
          <div className="grid gap-8 lg:grid-cols-2">
            {upcomingEvents.map((event) => {
              const [day, month] = event.date.split(" ");
              return (
                <div
                  key={event.id}
                  className="border-border bg-canvas group hover:border-text-muted relative flex flex-col gap-6 overflow-hidden rounded-3xl border p-8 transition-all duration-300 sm:flex-row"
                >
                  <div className="bg-brand/10 border-brand/20 text-brand flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center rounded-2xl border">
                    <span className="text-2xl font-black">{day}</span>
                    <span className="text-xs font-bold tracking-widest uppercase">{month}</span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <span className="text-brand text-xs font-semibold tracking-wider uppercase">
                        {event.phase}
                      </span>
                      <h3 className="text-text mt-1 text-2xl font-bold tracking-tight">
                        {event.title}
                      </h3>
                      <p className="text-text-muted mt-2 text-sm leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-text-muted text-xs font-medium">
                        {event.time} &bull; {event.location}
                      </span>
                      <Link href="/events">
                        <Button variant="outline" size="sm">
                          ลงทะเบียนร่วมงาน
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 8. Apple-Style Footer */}
      <footer className="bg-canvas text-text border-border border-t py-16">
        <Container clean>
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
            {/* Col 1 */}
            <div>
              <h5 className="text-text-muted text-xs font-bold tracking-wider uppercase">
                แพลตฟอร์มรุ่น
              </h5>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link href="/about" className="text-text-muted hover:text-text transition-colors">
                    ภาพรวมโปรเจกต์
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    แกลเลอรีรูปภาพ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/spotlight"
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    ทำเนียบศิษย์เก่า
                  </Link>
                </li>
                <li>
                  <Link
                    href="/timeline"
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    ไทม์ไลน์กิจกรรม
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 2 */}
            <div>
              <h5 className="text-text-muted text-xs font-bold tracking-wider uppercase">
                ชุมชนรุ่น 150
              </h5>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/events"
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    งานคืนสู่เหย้า
                  </Link>
                </li>
                <li>
                  <Link
                    href="/stories"
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    บันทึกความทรงจำ
                  </Link>
                </li>
                <li>
                  <Link href="/media" className="text-text-muted hover:text-text transition-colors">
                    คลังวิดีโอรุ่น
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h5 className="text-text-muted text-xs font-bold tracking-wider uppercase">
                คลังทรัพยากร
              </h5>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/downloads"
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    ดาวน์โหลดเอกสาร
                  </Link>
                </li>
                <li>
                  <Link
                    href="/downloads"
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    ภาพพื้นหลัง & โลโก้รุ่น
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h5 className="text-text-muted text-xs font-bold tracking-wider uppercase">
                เกี่ยวกับระบบ
              </h5>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link href="/about" className="text-text-muted hover:text-text transition-colors">
                    เกี่ยวกับพวกเรา
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-text-muted hover:text-text transition-colors">
                    ผู้ดูแลระบบ (Admin)
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-border mt-16 flex flex-col items-center justify-between gap-6 border-t pt-8 sm:flex-row">
            <div className="text-text-muted flex flex-col items-center gap-4 text-xs sm:flex-row">
              <span>&copy; {new Date().getFullYear()} SK150. สงวนลิขสิทธิ์ทั้งหมด.</span>
              <span className="hidden sm:inline">|</span>
              <a href="#" className="hover:text-text">
                ข้อตกลงการใช้งาน
              </a>
              <span className="hidden sm:inline">&bull;</span>
              <a href="#" className="hover:text-text">
                การตั้งค่าคุกกี้
              </a>
            </div>
            <div className="text-text-muted text-xs flex items-center gap-1.5">
              <span>Future Leaders</span>
              <span>&bull;</span>
              <span>พัฒนาโดยศิษย์เก่า รุ่น 150</span>
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}
