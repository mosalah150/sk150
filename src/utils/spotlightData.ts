import { StudentProfile } from "@/types/spotlight";

export const studentProfiles: StudentProfile[] = [
  {
    id: "maya-henderson",
    name: "Maya Henderson",
    title: "Class President",
    achievement: "Student Council President & Yearbook Coordinator",
    imageSrc: "/assets/spotlight.png",
    instagram: "https://instagram.com/maya_alumni",
    tiktok: "https://tiktok.com/@maya_alumni",
    youtube: "https://youtube.com",
    highlightQuote:
      "A yearbook isn't just about preserving photos; it's about holding onto the shared moments that shaped who we are today.",
    metrics: [
      { label: "GPA Score", value: "3.95" },
      { label: "Events Led", value: "12 Activities" },
      { label: "Class Size", value: "150 Alumni" },
    ],
    bioParagraphs: [
      "Maya Henderson served as Class President for the graduating class of SK150. Throughout her school years, she led the student council in organizing over a dozen campus community projects, including charity drives, homecoming festivals, and sports events.",
      "With a strong interest in media design, Maya spearheaded the creation of our class yearbook, leading a team of five students to document everyday memories, school sports matches, and classroom candids. Her goal was to create a digital register that classmates could access worldwide.",
      "After graduation, Maya plans to pursue a degree in Communications. She hopes to build platforms that connect communities and help school alumni groups keep their memories alive for generations to come.",
    ],
  },
  {
    id: "alex-thorne",
    name: "Alex Thorne",
    title: "Varsity Sports Captain",
    achievement: "Regional Football Champions Captain",
    imageSrc: "/assets/spotlight.png",
    instagram: "https://instagram.com/alex_sports",
    tiktok: "https://tiktok.com/@alex_sports",
    youtube: "https://youtube.com",
    highlightQuote:
      "Teamwork doesn't only apply to the field; it is the bond that held our class together through every challenge we faced.",
    metrics: [
      { label: "Goals Scored", value: "18 Goals" },
      { label: "Championships", value: "2 Titles" },
      { label: "School Spirit", value: "100%" },
    ],
    bioParagraphs: [
      "Alex Thorne is a Class of 150 student-athlete who served as the captain of the school's varsity football team. Under his leadership, the school won its first regional championship in five years, creating one of the most memorable sports highlights in our school's history.",
      "Beyond his achievements in athletics, Alex was an active volunteer in the peer tutoring program, helping his fellow classmates with mathematics and physical sciences. He believed that academic teamwork is just as important as victory on the sports track.",
      "Alex was accepted into the university sports science program. He aims to return to school as a coach in the future, mentoring the next generation of student-athletes and fostering the same school spirit that defined Class 150.",
    ],
  },
];
