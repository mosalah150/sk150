export interface DownloadFile {
  id: string;
  title: string;
  description: string;
  category: "PDF" | "Wallpaper" | "Logo" | "Documents";
  fileSize: string;
  fileExtension: string;
  href: string;
}
