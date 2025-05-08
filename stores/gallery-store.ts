import { create } from 'zustand';
import { ViewMode, SortType, FilterType, ImageData } from '@/types/types';

interface GalleryStore {
  viewMode: ViewMode;
  sortOrder: SortType;
  selectedImage: ImageData | null;
  setViewMode: (mode: ViewMode) => void;
  setSortOrder: (order: SortType) => void;
  setSelectedImage: (image: ImageData | null) => void;
}

export const useGalleryStore = create<GalleryStore>((set) => ({
  viewMode: 'masonry',
  sortOrder: 'newest',
  selectedImage: null,
  setViewMode: (mode) => set({ viewMode: mode }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setSelectedImage: (image) => set({ selectedImage: image }),
}));