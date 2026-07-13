export interface StudentMetric {
  label: string;
  value: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  title: string;
  achievement: string;
  bioParagraphs: string[];
  imageSrc: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  metrics: StudentMetric[];
  highlightQuote: string;
}
