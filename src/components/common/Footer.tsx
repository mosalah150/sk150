"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import { useDynamicData } from "@/providers/DynamicDataProvider";

const secondaryLinks = [
  { href: "/about", label: "เกี่ยวกับเรา" },
  { href: "/downloads", label: "ดาวน์โหลด" },
];

export default function Footer() {
  const { menus } = useDynamicData();

  return (
    <footer className="border-border bg-canvas-muted border-t">
      <Container className="flex flex-col gap-8 py-12 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0">
              <Image src="/assets/sk150_logo.png" alt="SK150 Logo" fill className="object-contain" />
            </div>
            <span className="text-text text-base font-black tracking-tight">
              SK150 <span className="text-text-muted font-semibold">Future Leaders</span>
            </span>
          </Link>
          <p className="text-text-muted max-w-sm text-sm leading-relaxed">
            ทำเนียบรุ่นดิจิทัลสำหรับนักเรียนศิษย์เก่าโรงเรียนสวนกุหลาบวิทยาลัย รุ่น 150
            พัฒนาโดยเครือข่ายผู้ปกครองโรงเรียนสวนกุหลาบวิทยาลัย รุ่น 150
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:gap-16">
          <div className="flex flex-col gap-3">
            <span className="text-text text-xs font-bold tracking-widest uppercase">
              หมวดหมู่
            </span>
            <nav className="flex flex-col gap-2">
              {menus.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="text-text-muted hover:text-text text-sm transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-text text-xs font-bold tracking-widest uppercase">
              ข้อมูลเพิ่มเติม
            </span>
            <nav className="flex flex-col gap-2">
              {secondaryLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-text-muted hover:text-text text-sm transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </Container>

      <div className="border-border border-t py-6">
        <Container clean className="flex flex-col items-center justify-between gap-4 text-xs sm:flex-row">
          <div className="text-text-muted flex flex-col items-center gap-2 sm:flex-row">
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
          <div className="text-text-muted flex items-center gap-1.5">
            <span>Future Leaders</span>
            <span>&bull;</span>
            <span>พัฒนาโดยผู้ปกครองโรงเรียนสวนกุหลาบวิทยาลัย รุ่น 150 (MoSalah 👑)</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
