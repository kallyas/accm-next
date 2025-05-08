"use client";

import { Toggle } from "@/components/ui/toggle";
import { Grid2X2, Rows3 } from "lucide-react";
import { useGalleryStore } from "@/stores/gallery-store";

function ViewToggle() {
  const { viewMode, setViewMode } = useGalleryStore();
  
  return (
    <div className="flex items-center space-x-2 bg-background/50 rounded-md p-1">
      <Toggle 
        pressed={viewMode === 'grid'} 
        onPressedChange={() => setViewMode('grid')}
        aria-label="Grid view"
        className="data-[state=on]:bg-muted"
      >
        <Grid2X2 size={16} />
      </Toggle>
      <Toggle 
        pressed={viewMode === 'masonry'} 
        onPressedChange={() => setViewMode('masonry')}
        aria-label="Masonry view"
        className="data-[state=on]:bg-muted"
      >
        <Rows3 size={16} />
      </Toggle>
    </div>
  );
}

export default ViewToggle;