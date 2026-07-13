"use client";

import React, { useState } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";

// Mock Committee Members
const committeeMembers = [
  {
    name: "เมษา ศิริวัฒนา (เมย์)",
    role: "ประธานสภานักเรียน & ประธานรุ่น 150",
    bio: "รับหน้าที่จัดตั้งคณะกรรมการสืบสานทำเนียบรุ่นดิจิทัล ประสานงานหนังสือรุ่น และกิจกรรมคืนสู่เหย้า",
    image: "/assets/spotlight.png",
  },
  {
    name: "อนันต์ เตชะวงศ์ (นนท์)",
    role: "กัปตันทีมกีฬาและประธานสปิริตรุ่น",
    bio: "ผู้จัดตั้งกิจกรรมกีฬาเชื่อมความสัมพันธ์ รณรงค์แนะแนวเรียนต่อน้อง ม.ปลาย และดูแลระบบสุขภาพศิษย์เก่า",
    image: "/assets/spotlight.png",
  },
  {
    name: "ธีรภัทร เมธา (เจมส์)",
    role: "คณะกรรมการฝ่ายมีเดียและเทคโนโลยี",
    bio: "ผู้ประสานการออกแบบภาพหน้าเว็บ รวบรวมคลังวิดีโอยูทูบ และบันทึกประวัติเหตุการณ์ในทำเนียบรุ่น",
    image: "/assets/spotlight.png",
  },
];

// Mock FAQs
const faqs = [
  {
    question: "ทำเนียบรุ่นดิจิทัล SK150 นี้จัดทำขึ้นเพื่ออะไร?",
    answer:
      "จัดทำขึ้นเพื่อรวบรวมข้อมูลเพื่อนร่วมรุ่น 150 และบันทึกความทรงจำวันสำเร็จการศึกษา กิจกรรมกีฬาสี และค่ายอาสา เพื่อสืบสานสายสัมพันธ์และเป็นพื้นที่เชื่อมโยงช่วยเหลือกันในอนาคต",
  },
  {
    question: "เพื่อนร่วมรุ่นคนอื่นสามารถเข้ามาอัปเดตประวัติหรือข้อมูลการติดต่อได้อย่างไร?",
    answer:
      "สามารถทำได้โดยติดต่อคณะทำงานผ่านกล่องข้อความหน้าติดต่อเรา หรือประสานงานโดยตรงกับประธานรุ่นเพื่ออัปเดตพอร์ตการติดต่อในหน้าทำเนียบศิษย์เก่า",
  },
  {
    question: "กิจกรรมคืนสู่เหย้าศิษย์เก่ามีกำหนดจัดขึ้นเป็นประจำทุกปีหรือไม่?",
    answer:
      "คณะทำงานรุ่นตั้งใจจัดกิจกรรมงานคืนสู่เหย้าอย่างน้อยปีละ 1 ครั้ง และมีการติววิชาแนะแนวเรียนต่อให้กับรุ่นน้องในช่วงวันสำคัญแบบไฮบริดทั้งในโรงเรียนและทางออนไลน์",
  },
  {
    question: "ปุ่มค้นหาอัจฉริยะ (⌘K) บนแถบเมนูใช้ค้นหาอะไรได้บ้าง?",
    answer:
      "ปุ่มค้นหาอัจฉริยะสามารถค้นหาได้แบบเรียลไทม์ทุกสิ่งบนแพลตฟอร์มนี้ เช่น ชื่อเล่นเพื่อนร่วมรุ่น หมวดหมู่กิจกรรม วันปัจฉิมนิเทศ หรือไฟล์ภาพพื้นหลังตราโรงเรียนสำหรับดาวน์โหลด",
  },
];

export default function AboutPage() {
  // FAQ accordion state: maps index -> open boolean
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Contact Form States
  const [formInputs, setFormInputs] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Turnstile Mock Captcha States
  const [isTurnstileVerified, setIsTurnstileVerified] = useState(false);
  const [isVerifyingTurnstile, setIsVerifyingTurnstile] = useState(false);

  const handleTurnstileVerify = () => {
    if (isTurnstileVerified || isVerifyingTurnstile) return;
    setIsVerifyingTurnstile(true);
    setTimeout(() => {
      setIsVerifyingTurnstile(false);
      setIsTurnstileVerified(true);
    }, 850);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInputs.name || !formInputs.email || !formInputs.message) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนทุกช่องครับ");
      return;
    }

    if (!isTurnstileVerified) {
      alert("กรุณากดปุ่มเพื่อยืนยันความปลอดภัย (Turnstile) ก่อนส่งข้อความ");
      return;
    }

    setIsSubmitting(true);

    // Simulate database write lag (1000ms)
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`ส่งข้อความของคุณเรียบร้อยแล้ว! ขอบคุณครับ คุณ ${formInputs.name}.`);
      setFormInputs({ name: "", email: "", message: "" });
      setIsTurnstileVerified(false);
    }, 1000);
  };

  return (
    <div className="bg-canvas text-text flex-1 pb-24 transition-colors duration-200 select-none">
      {/* 1. Page Header */}
      <section className="bg-canvas-muted border-border border-b py-16 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <span className="text-brand text-xs font-bold tracking-widest uppercase">
              คณะผู้จัดทำ
            </span>
            <h1 className="text-text mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              เกี่ยวกับ SK150
            </h1>
            <p className="text-text-muted mt-4 text-lg leading-relaxed">
              สืบสานความทรงจำ และแบ่งปันข้อมูลข่าวสารศิษย์เก่ารุ่น 150
              ในสไตล์เว็บทำเนียบรุ่นพรีเมียม
            </p>
          </div>
        </Container>
      </section>

      {/* 2. Vision & Mission Magazine Spread */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid items-start gap-12 sm:gap-16 md:grid-cols-2">
            {/* Vision Panel */}
            <div className="border-border bg-canvas hover:border-text-muted rounded-3xl border p-8 transition-all duration-300 sm:p-10">
              <span className="text-brand text-xs font-bold tracking-widest uppercase">
                ความมุ่งหวัง
              </span>
              <h2 className="text-text mt-3 text-3xl font-black tracking-tight">
                วิสัยทัศน์ของเรา
              </h2>
              <p className="text-text-muted mt-5 text-sm leading-relaxed sm:text-base">
                พวกเราเชื่อว่ามิตรภาพและความคุ้นเคยในห้องเรียนไม่ได้สิ้นสุดลงในวันรับประกาศนียบัตร
                เป้าหมายของเราคือการสร้างพื้นที่ดิจิทัลที่รวมเรื่องราวกิจกรรมกีฬาสี
                และรูปถ่ายแสนประทับใจของทุกคนไว้ในที่เดียว เพื่อการเชื่อมโยงอย่างยั่งยืน
              </p>
            </div>

            {/* Mission Panel */}
            <div className="border-border bg-canvas hover:border-text-muted rounded-3xl border p-8 transition-all duration-300 sm:p-10">
              <span className="text-brand text-xs font-bold tracking-widest uppercase">
                การลงมือทำ
              </span>
              <h2 className="text-text mt-3 text-3xl font-black tracking-tight">พันธกิจของเรา</h2>
              <p className="text-text-muted mt-5 text-sm leading-relaxed sm:text-base">
                พวกเรามุ่งมั่นจัดเก็บประวัติข้อมูลศิษย์เก่าในลักษณะที่ปลอดภัย
                จัดทำกิจกรรมช่วยเหลือสังคม แนะแนวน้องๆ รุ่นหลังที่ต้องการสอบเข้ามหาวิทยาลัย
                และเป็นศูนย์กลางข่าวสารของรุ่น 150
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. History Timeline Roadmaps */}
      <section className="bg-canvas-muted border-border border-y py-20">
        <Container>
          <SectionHeader
            title="ไทม์ไลน์พัฒนาการของรุ่น"
            subtitle="เส้นทางการเรียนรู้และจุดเปลี่ยนสำคัญของพวกเราตลอดหลายปีที่ผ่านมา"
          />

          <div className="border-border relative mx-auto ml-4 max-w-4xl space-y-12 border-l pl-10 sm:ml-8 sm:pl-12 md:ml-12">
            {/* milestone 01 */}
            <div className="relative">
              <div className="bg-canvas ring-canvas-muted absolute top-1.5 -left-[51px] flex h-6 w-6 items-center justify-center rounded-full ring-8 sm:-left-[59px]">
                <span className="bg-brand h-3.5 w-3.5 rounded-full" />
              </div>
              <div>
                <span className="text-brand text-xs font-bold tracking-wider uppercase">
                  2026 &bull; ปีสำเร็จการศึกษา
                </span>
                <h3 className="mt-1 text-xl font-bold tracking-tight">
                  ปัจฉิมนิเทศและเปิดตัวทำเนียบรุ่น
                </h3>
                <p className="text-text-muted mt-2 text-xs leading-relaxed sm:text-sm">
                  สำเร็จการศึกษาระดับมัธยมศึกษาอย่างเป็นทางการ พร้อมจัดทำหนังสือรุ่น
                  และพัฒนาทำเนียบรุ่นดิจิทัลขึ้นสู่เซิร์ฟเวอร์เพื่อให้เพื่อนๆ
                  ทุกคนล็อกอินเข้ามาหาเบอร์โทรติดต่อ
                </p>
              </div>
            </div>

            {/* milestone 02 */}
            <div className="relative">
              <div className="bg-canvas ring-canvas-muted absolute top-1.5 -left-[51px] flex h-6 w-6 items-center justify-center rounded-full ring-8 sm:-left-[59px]">
                <span className="bg-border h-3.5 w-3.5 rounded-full" />
              </div>
              <div>
                <span className="text-text-muted text-xs font-bold tracking-wider uppercase">
                  2024 &bull; กิจกรรมสร้างชื่อเสียง
                </span>
                <h3 className="mt-1 text-xl font-bold tracking-tight">
                  ชนะเลิศฟุตบอลกีฬาสีประเพณี
                </h3>
                <p className="text-text-muted mt-2 text-xs leading-relaxed sm:text-sm">
                  กวาดรางวัลแข่งกีฬาวิ่งกรีฑาและคว้าถ้วยแชมป์ฟุตบอลโรงเรียนประจำปี
                  สร้างความสนิทสนมกลมเกลียวและการเชียร์แบบสร้างสรรค์
                </p>
              </div>
            </div>

            {/* milestone 03 */}
            <div className="relative">
              <div className="bg-canvas ring-canvas-muted absolute top-1.5 -left-[51px] flex h-6 w-6 items-center justify-center rounded-full ring-8 sm:-left-[59px]">
                <span className="bg-border h-3.5 w-3.5 rounded-full" />
              </div>
              <div>
                <span className="text-text-muted text-xs font-bold tracking-wider uppercase">
                  2023 &bull; ก้าวแรกแห่งการรวมตัว
                </span>
                <h3 className="mt-1 text-xl font-bold tracking-tight">วันปฐมนิเทศและค่ายปฐมวัย</h3>
                <p className="text-text-muted mt-2 text-xs leading-relaxed sm:text-sm">
                  เข้าสู่โรงเรียน ค้นพบเพื่อนห้องเรียนใหม่ ค่ายละลายพฤติกรรมดนตรีและศิลปะ
                  ที่เป็นจุดเริ่มต้นมิตรภาพอันยาวนาน
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Committee Board Grid */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeader
            title="คณะกรรมการตัวแทนรุ่น"
            subtitle="ทำความรู้จักผู้มีบทบาทประสานงานและขับเคลื่อนกิจกรรมศิษย์เก่าในปัจจุบัน"
          />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {committeeMembers.map((member, index) => (
              <div
                key={index}
                className="bg-canvas border-border hover:border-text-muted flex flex-col items-center rounded-3xl border p-6 text-center transition-all duration-300 hover:shadow-md sm:p-8"
              >
                <div className="border-border bg-canvas-muted relative h-24 w-24 overflow-hidden rounded-full border">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-text mt-4 text-lg font-bold">{member.name}</h3>
                <span className="text-brand mt-1 text-xs font-bold tracking-wider uppercase">
                  {member.role}
                </span>
                <p className="text-text-muted mt-4 text-xs leading-relaxed sm:text-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. FAQs Accordion list */}
      <section className="bg-canvas-muted border-border border-y py-20">
        <Container>
          <SectionHeader
            title="คำถามที่พบบ่อย"
            subtitle="คำถามและความรู้ทางเทคนิคทั่วไปสำหรับการใช้งานและวัตถุประสงค์ของเว็บ SK150"
          />

          <div className="mx-auto max-w-3xl space-y-4 text-left">
            {faqs.map((faq, index) => {
              const isOpen = index === openFaqIndex;

              return (
                <div
                  key={index}
                  className="bg-canvas border-border overflow-hidden rounded-2xl border transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left text-sm font-bold focus-visible:outline-none sm:text-base"
                  >
                    <span>{faq.question}</span>
                    <svg
                      className={`text-text-muted h-4.5 w-4.5 transform transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="border-border animate-in fade-in slide-in-from-top-1 border-t px-6 pt-2 pb-6 duration-150">
                      <p className="text-text-muted text-xs leading-relaxed sm:text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 6. Contact Panel Grid */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid items-start gap-12 sm:gap-16 lg:grid-cols-12">
            {/* Left Column: Office Contacts */}
            <div className="text-left lg:col-span-5">
              <span className="text-brand text-xs font-bold tracking-widest uppercase">
                การติดต่อเรา
              </span>
              <h2 className="text-text mt-3 text-3xl font-black tracking-tight">
                ติดต่อสภานักเรียน
              </h2>
              <p className="text-text-muted mt-4 text-sm leading-relaxed sm:text-base">
                หากคุณมีข้อเสนอแนะในการจัดกิจกรรมรุ่น หรือต้องการขอเพิ่มประวัติข้อมูลศิษย์เก่าในระบบ
                กรุณาส่งข้อความติดต่อฝ่ายประชาสัมพันธ์
              </p>

              <div className="text-text-muted mt-8 space-y-6 text-sm font-semibold">
                <div className="flex items-center gap-3">
                  <svg
                    className="text-brand h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>contact@sk150.pages.dev</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="text-brand h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  <span>ห้องสภานักเรียนชั้น 2 อาคารอำนวยการ</span>
                </div>
              </div>
            </div>

            {/* Right Column: Input Message Form */}
            <div className="bg-canvas-muted border-border rounded-3xl border p-6 sm:p-8 lg:col-span-7">
              <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
                <div>
                  <label
                    htmlFor="name"
                    className="text-text-muted mb-2 block text-xs font-bold tracking-wider uppercase"
                  >
                    ชื่อของคุณ
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formInputs.name}
                    onChange={handleInputChange}
                    placeholder="กรุณากรอกชื่อ-นามสกุลของคุณ"
                    className="bg-canvas border-border text-text placeholder-text-muted focus:border-brand w-full rounded-xl border px-4 py-3 text-sm focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-text-muted mb-2 block text-xs font-bold tracking-wider uppercase"
                  >
                    อีเมลติดต่อ
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formInputs.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="bg-canvas border-border text-text placeholder-text-muted focus:border-brand w-full rounded-xl border px-4 py-3 text-sm focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="text-text-muted mb-2 block text-xs font-bold tracking-wider uppercase"
                  >
                    ข้อความ / คำถามของคุณ
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formInputs.message}
                    onChange={handleInputChange}
                    placeholder="ระบุข้อความที่คุณต้องการส่งให้เรา"
                    className="bg-canvas border-border text-text placeholder-text-muted focus:border-brand w-full resize-none rounded-xl border px-4 py-3 text-sm focus:outline-none"
                    required
                  />
                </div>

                {/* Cloudflare Turnstile Mock Widget */}
                <div className="border-border bg-canvas flex max-w-sm items-center justify-between rounded-2xl border p-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleTurnstileVerify}
                      disabled={isTurnstileVerified || isVerifyingTurnstile}
                      className={`flex h-6 w-6 items-center justify-center rounded border transition-all ${
                        isTurnstileVerified
                          ? "bg-brand/10 border-brand text-brand"
                          : "border-border hover:border-text-muted cursor-pointer"
                      }`}
                    >
                      {isVerifyingTurnstile && (
                        <div className="border-brand h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-transparent" />
                      )}
                      {isTurnstileVerified && (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className="text-text-muted text-xs font-semibold select-none">
                      {isTurnstileVerified
                        ? "ยืนยันความปลอดภัยสำเร็จ"
                        : isVerifyingTurnstile
                          ? "กำลังตรวจสอบ..."
                          : "โปรดยืนยันว่าคุณเป็นมนุษย์"}
                    </span>
                  </div>
                  <div className="pointer-events-none flex flex-col items-end opacity-80 select-none">
                    <div className="flex items-center gap-1.5">
                      <svg
                        className="text-brand h-4.5 w-4.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <span className="text-text font-sans text-[10px] font-black tracking-wide">
                        Turnstile
                      </span>
                    </div>
                    <span className="text-text-muted mt-0.5 text-[7px] font-bold tracking-widest uppercase">
                      Privacy • Terms
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isTurnstileVerified}
                    className={`focus-visible:outline-brand cursor-pointer rounded-full border px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-all focus-visible:outline focus-visible:outline-2 ${
                      isSubmitting || !isTurnstileVerified
                        ? "bg-canvas-muted text-text-muted border-border cursor-not-allowed"
                        : "bg-text text-canvas hover:bg-canvas hover:text-text hover:border-text border-transparent"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="border-text-muted h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-transparent" />
                        กำลังส่งข้อความ...
                      </span>
                    ) : (
                      "ส่งข้อความ"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
