export interface ImageData {
  id: number;
  src: string;
  alt: string;
  category: "events" | "success" | "others";
  description: string;
  date: string;
  width: number;
  height: number;
  tags?: string[];
  featured?: boolean;
}

export type FilterType = "all" | "events" | "success" | "featured" | "others";
export type SortType = "newest" | "oldest" | "popular";
export type ViewMode = "grid" | "masonry";
