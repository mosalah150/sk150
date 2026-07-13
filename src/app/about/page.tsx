"use client";

import React, { useState } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";

// Mock Committee / Parent Network Info
const committeeMembers = [
  {
    name: "เครือข่ายผู้ปกครอง รุ่น 150",
    role: "ผู้พัฒนา & ผู้สนับสนุนระบบหลัก",
    bio: "ร่วมมือร่วมใจสนับสนุนงบประมาณการพัฒนา และประสานงานด้านระบบฐานข้อมูล เพื่อรวบรวมสายสัมพันธ์ระหว่างผู้ปกครอง นักเรียน และคณะครูอาจารย์",
    image: "/assets/spotlight.png",
  },
  {
    name: "คณะกรรมการนักเรียน สวนกุหลาบฯ รุ่น 150",
    role: "ผู้ประสานงานและจัดเก็บบันทึกประวัติ",
    bio: "รับหน้าที่รวบรวมประวัติ ช่องทางติดต่อ และภาพถ่ายกิจกรรม ตั้งแต่วันแรกที่ก้าวเข้าสู่รั้วชมพู-ฟ้า จนถึงวันจบการศึกษาเป็นสุภาพบุรุษสวนกุหลาบฯ",
    image: "/assets/spotlight.png",
  },
];

// Mock FAQs adjusted for Suankularb Class 150
const faqs = [
  {
    question: "ทำเนียบดิจิทัล SK150 นี้จัดทำขึ้นโดยใคร?",
    answer:
      "แพลตฟอร์มนี้พัฒนาและจัดทำขึ้นโดย เครือข่ายผู้ปกครองโรงเรียนสวนกุหลาบวิทยาลัย รุ่น 150 (ชื่อรุ่น: ผู้นำแห่งอนาคต Future Leaders) เพื่อเป็นของขวัญและพื้นที่รวบรวมความทรงจำ กิจกรรมประเพณี และการติดต่อสำหรับเพื่อนร่วมรุ่นทุกคน",
  },
  {
    question: "เพื่อนร่วมรุ่นสามารถเข้ามาอัปเดตประวัติหรือข้อมูลการติดต่อได้อย่างไร?",
    answer:
      "นักเรียนรุ่น 150 ทุกคนสามารถติดต่อคณะกรรมการรุ่น หรือผู้ประสานงานทางเทคโนโลยีเพื่อขอเข้าถึงระบบหรือแก้ไขข้อมูลส่วนตัว เช่น Instagram, TikTok หรือประวัติเด่นในหน้าทำเนียบศิษย์เก่า",
  },
  {
    question: "ที่มาของชื่อรุ่น 'ผู้นำแห่งอนาคต' (Future Leaders) คืออะไร?",
    answer:
      "เป็นชื่อรุ่นที่นักเรียนและเครือข่ายรุ่น 150 ร่วมกันคัดเลือก เพื่อสะท้อนเป้าหมายการเป็นผู้นำที่ดี มีศีลธรรม และขับเคลื่อนสังคมไทยให้ก้าวหน้า ตามเกียรติยศและปณิธานของสุภาพบุรุษชาวชมพู-ฟ้า",
  },
  {
    question: "การติดต่อสอบถามหรือแจ้งปัญหาการใช้งานเว็บไซต์ทำได้อย่างไร?",
    answer:
      "สามารถแจ้งรายละเอียดเข้ามาผ่านแบบฟอร์มการติดต่อด้านล่างของหน้านี้ หรืออีเมลโดยตรงหาทีมดูแลระบบเครือข่ายผู้ปกครอง ซึ่งจะมีเจ้าหน้าที่คอยช่วยตอบคำถามและดูแลปรับปรุงข้อมูลให้เรียลไทม์ครับ",
  },
];

export default function AboutPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Contact Form States
  const [formInputs, setFormInputs] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Turnstile Verification States (Simulated)
  const [isTurnstileVerified, setIsTurnstileVerified] = useState(false);
  const [isVerifyingTurnstile, setIsVerifyingTurnstile] = useState(false);

  const simulateTurnstile = () => {
    if (isTurnstileVerified || isVerifyingTurnstile) return;
    setIsVerifyingTurnstile(true);
    setTimeout(() => {
      setIsVerifyingTurnstile(false);
      setIsTurnstileVerified(true);
    }, 1200);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInputs.name || !formInputs.email || !formInputs.message) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนก่อนส่งข้อความ");
      return;
    }
    if (!isTurnstileVerified) {
      alert("กรุณายืนยันตัวตนผ่าน Cloudflare Turnstile ก่อนส่งข้อความ");
      return;
    }

    setIsSubmitting(true);
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
              ทำเนียบดิจิทัลโรงเรียนสวนกุหลาบวิทยาลัย รุ่น 150 ผู้นำแห่งอนาคต 
              พัฒนาโดยเครือข่ายผู้ปกครองเพื่อรวบรวมมิตรภาพและสายสัมพันธ์อันยั่งยืน
            </p>
          </div>
        </Container>
      </section>

      {/* 2. Vision & Mission magazine style */}
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
                สืบสานสายสัมพันธ์ &ldquo;ชมพู-ฟ้า&rdquo; ของสถาบันโรงเรียนชายล้วนอันดับหนึ่งของประเทศ 
                เชื่อมต่อเพื่อนร่วมชั้นเรียน และสนับสนุนทุกความก้าวหน้าของสุภาพบุรุษสวนกุหลาบวิทยาลัย รุ่น 150 
                ในฐานะผู้นำแห่งอนาคตที่จะทำประโยชน์แก่สังคมไทยต่อไป
              </p>
            </div>

            {/* Mission Panel */}
            <div className="border-border bg-canvas hover:border-text-muted rounded-3xl border p-8 transition-all duration-300 sm:p-10">
              <span className="text-brand text-xs font-bold tracking-widest uppercase">
                การลงมือทำ
              </span>
              <h2 className="text-text mt-3 text-3xl font-black tracking-tight">พันธกิจของเรา</h2>
              <p className="text-text-muted mt-5 text-sm leading-relaxed sm:text-base">
                เก็บบันทึกประวัติและเกียรติประวัติอันงดงามของรุ่น, ส่งเสริมความสามัคคีร่วมใจผ่านกิจกรรมคืนสู่เหย้า, 
                สนับสนุนรุ่นน้องในการศึกษาต่อ และจัดเตรียมทรัพยากร/แนะแนวอาชีพที่ยั่งยืนโดยการประสานงานของเครือข่ายผู้ปกครอง
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. History Timeline Roadmaps */}
      <section className="bg-canvas-muted border-border border-y py-20">
        <Container>
          <SectionHeader
            title="เส้นทางแห่งเกียรติยศชมพู-ฟ้า"
            subtitle="ช่วงเวลาสำคัญและการรวมพลังขับเคลื่อนกิจกรรมของสวนกุหลาบวิทยาลัย รุ่น 150"
          />

          <div className="border-border relative mx-auto ml-4 max-w-4xl space-y-12 border-l pl-10 sm:ml-8 sm:pl-12 md:ml-12">
            {/* milestone 01 */}
            <div className="relative">
              <div className="bg-canvas ring-canvas-muted absolute top-1.5 -left-[51px] flex h-6 w-6 items-center justify-center rounded-full ring-8 sm:-left-[59px]">
                <span className="bg-brand h-3.5 w-3.5 rounded-full" />
              </div>
              <div>
                <span className="text-brand text-xs font-bold tracking-wider uppercase">
                  ปีสำเร็จการศึกษา &bull; ผู้นำแห่งอนาคต
                </span>
                <h3 className="mt-1 text-xl font-bold tracking-tight">
                  พิธีปัจฉิมนิเทศ สุภาพบุรุษรุ่น 150
                </h3>
                <p className="text-text-muted mt-2 text-xs leading-relaxed sm:text-sm">
                  วันแห่งเกียรติยศและการก้าวออกจากรั้วชมพู-ฟ้า พร้อมเปิดตัวทำเนียบดิจิทัลอย่างเป็นทางการ 
                  โดยการผลักดันระบบจัดเก็บข้อมูลของเครือข่ายผู้ปกครอง เพื่อความสามัคคีระยะยาว
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
                  กีฬาสีประเพณี &bull; พลังชมพู-ฟ้า
                </span>
                <h3 className="mt-1 text-xl font-bold tracking-tight">
                  คว้าแชมป์ฟุตบอลและกรีฑาโรงเรียน
                </h3>
                <p className="text-text-muted mt-2 text-xs leading-relaxed sm:text-sm">
                  นักเรียนรุ่น 150 ร่วมแรงเชียร์สปิริต กวาดรางวัลแชมป์ฟุตบอลและสแตนด์เชียร์กีฬาสี
                  แสดงความสมัครสมานสามัคคีอันเป็นเอกลักษณ์ของชาวสวนกุหลาบฯ
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
                  วันแรกสู่ตึกยาว &bull; ก้าวแรกสุภาพบุรุษ
                </span>
                <h3 className="mt-1 text-xl font-bold tracking-tight">วันปฐมนิเทศก้าวแรกสู่ตึกยาวสวนกุหลาบ</h3>
                <p className="text-text-muted mt-2 text-xs leading-relaxed sm:text-sm">
                  ก้าวเข้าสู่รั้วโรงเรียนสวนกุหลาบวิทยาลัยอย่างเป็นทางการ ร่วมทำพิธีถวายบังคมพระบรมราชานุสาวรีย์ รัชกาลที่ 5 
                  และรับฟังการอบรมวิชาสุภาพบุรุษสวนกุหลาบฯ
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Team Members GRID */}
      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeader
            title="คณะทำงานผู้สร้างสรรค์ระบบ"
            subtitle="ทีมงานประสานงานจากเครือข่ายผู้ปกครองและตัวแทนคณะกรรมการนักเรียน สวนกุหลาบฯ รุ่น 150"
          />

          <div className="grid gap-12 sm:grid-cols-2">
            {committeeMembers.map((member, idx) => (
              <div
                key={idx}
                className="border-border bg-canvas-muted hover:border-text-muted flex flex-col items-center rounded-[32px] border p-8 text-center transition-all duration-300 hover:shadow-lg sm:p-12"
              >
                <div className="relative mb-6 h-28 w-28 overflow-hidden rounded-full border border-border shadow-sm">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <h3 className="text-text text-xl font-black tracking-tight">{member.name}</h3>
                <span className="text-brand mt-1.5 text-xs font-semibold uppercase">
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

      {/* 5. FAQs Accordion */}
      <section className="bg-canvas-muted border-border border-y py-24 sm:py-32">
        <Container className="max-w-4xl">
          <SectionHeader
            title="คำถามที่พบบ่อย (FAQs)"
            subtitle="ข้อมูลและสิ่งที่คุณอาจต้องการทราบเพิ่มเติมเกี่ยวกับการดำเนินงานทำเนียบดิจิทัล SK150"
            className="text-center"
          />

          <div className="mt-12 space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border-border bg-canvas rounded-2xl border overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-text font-bold text-sm sm:text-base">{faq.question}</span>
                    <span className="text-brand ml-4 flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 transition-transform duration-200">
                      <svg
                        className={`h-4 w-4 transform transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-[300px] border-t border-border opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-text-muted p-6 text-xs leading-relaxed sm:text-sm">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 6. Secure Contact Form */}
      <section className="py-24 sm:py-32">
        <Container className="max-w-2xl">
          <div className="border-border bg-canvas-muted rounded-[32px] border p-8 sm:p-12 shadow-md">
            <span className="text-brand text-xs font-bold tracking-widest uppercase block text-center">
              ส่งคำขออัปเดตหรือแจ้งข้อเสนอแนะ
            </span>
            <h2 className="text-text mt-3 text-center text-3xl font-black tracking-tight sm:text-4xl">
              ติดต่อแอดมินระบบ
            </h2>
            <p className="text-text-muted mt-4 text-center text-xs leading-relaxed sm:text-sm">
              แบบฟอร์มการติดต่อประสานงานแอดมินสำหรับเครือข่ายผู้ปกครองและนักเรียนสวนกุหลาบวิทยาลัย รุ่น 150
            </p>

            <div className="mt-10">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label htmlFor="contact-name" className="text-text-muted text-xs font-bold select-none">
                    ชื่อ-นามสกุล
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formInputs.name}
                    onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })}
                    placeholder="ตัวอย่าง: นายสมยศ รักษ์ดี"
                    className="border-border bg-canvas text-text mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="text-text-muted text-xs font-bold select-none">
                    อีเมลติดต่อกลับ
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formInputs.email}
                    onChange={(e) => setFormInputs({ ...formInputs, email: e.target.value })}
                    placeholder="ตัวอย่าง: somyot@email.com"
                    className="border-border bg-canvas text-text mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="text-text-muted text-xs font-bold select-none">
                    ข้อความหรือจุดประสงค์ที่ต้องการติดต่อ
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formInputs.message}
                    onChange={(e) => setFormInputs({ ...formInputs, message: e.target.value })}
                    placeholder="ตัวอย่าง: ต้องการขอเพิ่มข้อมูลประวัติในหน้าทำเนียบ หรือส่งเรื่องราวกิจกรรมรุ่นประดับในหน้าบันทึกความทรงจำ..."
                    className="border-border bg-canvas text-text mt-2 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors resize-none"
                  />
                </div>

                {/* Turnstile Interactive Widget */}
                <div className="border-border bg-canvas flex flex-col items-center justify-between gap-4 rounded-2xl border p-4 sm:flex-row">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={simulateTurnstile}
                      className={`relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-border transition-all ${
                        isTurnstileVerified ? "bg-brand border-brand" : "bg-canvas-muted hover:bg-canvas"
                      }`}
                      aria-label="Verify Turnstile"
                    >
                      {isVerifyingTurnstile && (
                        <div className="border-brand h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-transparent" />
                      )}
                      {isTurnstileVerified && (
                        <svg
                          className="h-4.5 w-4.5 text-canvas"
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
