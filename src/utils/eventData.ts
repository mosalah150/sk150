import { EventItem } from "@/types/event";

export const events: EventItem[] = [
  {
    id: "1",
    title: "งานคืนสู่เหย้าศิษย์เก่า รุ่น 150 ประจำปี",
    description:
      "งานเลี้ยงสังสรรค์รวมรุ่นครบรอบปีแรกหลังจบการศึกษา ร่วมพูดคุย แลกเปลี่ยนประสบการณ์การทำงานและการเรียนต่อ พร้อมรับประทานอาหารเย็นร่วมกัน",
    type: "upcoming",
    date: "24 กรกฎาคม 2026",
    time: "18:00 น. เป็นต้นไป",
    location: "หอประชุมใหญ่โรงเรียน & ซูมออนไลน์",
    locationType: "physical",
    countdownTarget: "2026-07-24T18:00:00.000Z",
    coverImage: "/assets/gallery_2.png",
    galleryImages: ["/assets/gallery_2.png", "/assets/gallery_5.png"],
    phase: "คืนสู่เหย้า",
  },
  {
    id: "2",
    title: "กิจกรรมแนะแนวการศึกษาและแบ่งปันสู่น้องๆ ม.ปลาย",
    description:
      "รุ่นพี่ศิษย์เก่าร่วมแบ่งปันเทคนิคการสอบเข้ามหาวิทยาลัย แนะนำคณะวิชาต่างๆ และการปรับตัวในรั้วอุดมศึกษาให้แก่รุ่นน้องในโรงเรียน",
    type: "upcoming",
    date: "12 สิงหาคม 2026",
    time: "13:00 - 16:30 น.",
    location: "ห้องประชุมวิชาการ อาคาร 3",
    locationType: "physical",
    countdownTarget: "2026-08-12T13:00:00.000Z",
    coverImage: "/assets/gallery_1.png",
    galleryImages: ["/assets/gallery_1.png", "/assets/gallery_4.png"],
    phase: "โครงการปันความรู้",
  },
  {
    id: "3",
    title: "การแข่งขันทัวร์นาเมนต์ฟุตบอลกระชับมิตรศิษย์เก่า",
    description:
      "การแข่งขันฟุตบอลเชื่อมความสัมพันธ์ระหว่างกลุ่มศิษย์เก่าและคณะอาจารย์ ชิงถ้วยเกียรติยศเพื่อสมทบทุนจัดซื้ออุปกรณ์กีฬาให้โรงเรียน",
    type: "past",
    date: "15 มิถุนายน 2026",
    time: "16:00 น. เป็นต้นไป",
    location: "สนามฟุตบอลใหญ่ของโรงเรียน",
    locationType: "physical",
    coverImage: "/assets/gallery_4.png",
    galleryImages: ["/assets/gallery_4.png", "/assets/gallery_5.png", "/assets/gallery_2.png"],
    videoUrl: "dQw4w9WgXcQ",
    phase: "การแข่งขันกีฬา",
  },
  {
    id: "4",
    title: "กิจกรรมจิตอาสาฟื้นฟูชุมชนและมอบของใช้วันเปิดเทอม",
    description:
      "กลุ่มศิษย์เก่าร่วมกับนักเรียนปัจจุบันเดินทางไปทาสี ปรับปรุงห้องสมุด และมอบอุปกรณ์การเรียนแก่โรงเรียนขนาดเล็กในชุมชนใกล้เคียง",
    type: "past",
    date: "20 พฤษภาคม 2026",
    time: "09:00 น. เป็นต้นไป",
    location: "โรงเรียนชุมชนวัดบ้านบ่อ",
    locationType: "physical",
    coverImage: "/assets/gallery_1.png",
    galleryImages: ["/assets/gallery_1.png", "/assets/gallery_2.png"],
    phase: "โครงการจิตอาสา",
  },
];
