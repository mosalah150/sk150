export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  album: string;
  aspectRatio: "video" | "square" | "portrait" | "wide";
  location?: string;
  date?: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: "1",
    title: "บรรยากาศในห้องเรียนวิทยาศาสตร์",
    description: "การทดลองเคมีและชีววิทยาในห้องแล็บวิทยาศาสตร์ของอาคารเรียนหลัก",
    imageSrc: "/assets/gallery_2.png",
    album: "การเรียนการสอน",
    aspectRatio: "video",
    location: "ห้องปฏิบัติการเคมี",
    date: "กรกฎาคม 2026",
  },
  {
    id: "2",
    title: "ผลงานภาพวาดสีน้ำมันของห้องศิลปะ",
    description: "ภาพวาดแนวระบายสีน้ำมันฝีมือนักเรียนศิลปะที่จัดแสดงในแกลเลอรีโรงเรียน",
    imageSrc: "/assets/gallery_1.png",
    album: "ศิลปะและวิชาการ",
    aspectRatio: "portrait",
    location: "สตูดิโอศิลปะ อาคาร 4",
    date: "มิถุนายน 2026",
  },
  {
    id: "3",
    title: "วิวสนามโรงเรียนยามเย็น",
    description: "ภาพถ่ายมุมสูงมองเห็นทางเดินและต้นไม้ใหญ่รอบสนามฟุตบอลโรงเรียนในเวลาพระอาทิตย์ตก",
    imageSrc: "/assets/hero_bg.png",
    album: "อาคารสถานที่",
    aspectRatio: "wide",
    location: "ดาดฟ้าอาคาร 2",
    date: "พฤษภาคม 2026",
  },
  {
    id: "4",
    title: "วินาทีเข้าเส้นชัยการวิ่งแข่ง 100 เมตร",
    description: "ภาพจังหวะการแข่งขันกรีฑาในกีฬาสีประจำปีที่เพื่อนๆ ร่วมใจวิ่งสุดกำลัง",
    imageSrc: "/assets/gallery_3.png",
    album: "กีฬาโรงเรียน",
    aspectRatio: "video",
    location: "ลู่วิ่งสนามใหญ่",
    date: "กรกฎาคม 2026",
  },
  {
    id: "5",
    title: "โต๊ะจัดทำหนังสือทำเนียบรุ่น 150",
    description: "ทีมบรรณาธิการหนังสือรุ่นกำลังหารือ คัดแยกรูปถ่ายกิจกรรมศิษย์เก่า",
    imageSrc: "/assets/spotlight.png",
    album: "เบื้องหลังกิจกรรม",
    aspectRatio: "portrait",
    location: "ห้องสภานักเรียน",
    date: "มิถุนายน 2026",
  },
  {
    id: "6",
    title: "ภาพหมู่จำลองเพื่อนร่วมรุ่น 150",
    description: "การรวมตัวกันของเพื่อนๆ หน้าเสาธงในวันปัจฉิมนิเทศสำเร็จการศึกษา",
    imageSrc: "/assets/gallery_4.png",
    album: "วันจบการศึกษา",
    aspectRatio: "wide",
    location: "ลานอเนกประสงค์หน้าเสาธง",
    date: "กรกฎาคม 2026",
  },
  {
    id: "7",
    title: "ห้องสมุดกลางโรงเรียนโฉมใหม่",
    description: "มุมหนังสือและโต๊ะสำหรับทบทวนวิชาในห้องสมุดหลังจากมีการปรับปรุงตกแต่งใหม่",
    imageSrc: "/assets/gallery_5.png",
    album: "อาคารสถานที่",
    aspectRatio: "square",
    location: "ห้องสมุดใหญ่ อาคาร 1",
    date: "เมษายน 2026",
  },
];
