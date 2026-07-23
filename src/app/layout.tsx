import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { DynamicDataProvider } from "@/providers/DynamicDataProvider";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "SK150 ผู้นำแห่งอนาคต | โรงเรียนสวนกุหลาบวิทยาลัย รุ่น 150",
    template: "%s | SK150 ผู้นำแห่งอนาคต",
  },
  description: "ทำเนียบรุ่นดิจิทัลสำหรับนักเรียนศิษย์เก่าโรงเรียนสวนกุหลาบวิทยาลัย รุ่น 150 (ชื่อรุ่น: ผู้นำแห่งอนาคต Future Leaders) พัฒนาโดยเครือข่ายผู้ปกครองโรงเรียนสวนกุหลาบวิทยาลัย รุ่น 150",
  metadataBase: new URL("https://sk150.pages.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SK150 ผู้นำแห่งอนาคต | โรงเรียนสวนกุหลาบวิทยาลัย รุ่น 150",
    description: "ทำเนียบรุ่นดิจิทัลสำหรับนักเรียนศิษย์เก่าโรงเรียนสวนกุหลาบวิทยาลัย รุ่น 150 (ชื่อรุ่น: ผู้นำแห่งอนาคต Future Leaders) พัฒนาโดยเครือข่ายผู้ปกครองโรงเรียนสวนกุหลาบวิทยาลัย รุ่น 150",
    url: "https://sk150.pages.dev",
    siteName: "SK150",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SK150 ผู้นำแห่งอนาคต | โรงเรียนสวนกุหลาบวิทยาลัย รุ่น 150",
    description: "ทำเนียบรุ่นดิจิทัลสำหรับนักเรียนศิษย์เก่าโรงเรียนสวนกุหลาบวิทยาลัย รุ่น 150 (ชื่อรุ่น: ผู้นำแห่งอนาคต Future Leaders) พัฒนาโดยเครือข่ายผู้ปกครองโรงเรียนสวนกุหลาบวิทยาลัย รุ่น 150",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const colorScheme = localStorage.getItem('color-scheme');
                  if (colorScheme && colorScheme !== 'system') {
                    const meta = document.querySelector('meta[name="color-scheme"]');
                    if (meta) meta.content = colorScheme;
                    if (colorScheme === 'dark') {
                      document.documentElement.classList.add('dark');
                    } else if (colorScheme === 'light') {
                      document.documentElement.classList.add('light');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-canvas text-text flex min-h-full flex-col">
        <a
          href="#content"
          className="focus:bg-canvas focus:text-brand focus:border-border sr-only text-sm font-bold focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:border focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <DynamicDataProvider>
            <Navbar />
            {children}
            <Footer />
          </DynamicDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
