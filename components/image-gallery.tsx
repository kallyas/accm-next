"use client";

import { useState, useEffect, useMemo, memo, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Masonry from "react-masonry-css";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Download,
  X,
  Share2,
  Heart,
  Calendar,
  Tag,
  Search,
  SlidersHorizontal,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { allImages, eventImages, successImages, otherImages } from "@/data";
import { ImageData, FilterType, SortType } from "@/types/types";
import { useGalleryStore } from "@/stores/gallery-store";
import { ImageModal } from "./image-modal";

export function ImageGallery({ filter = "all" }: { filter?: FilterType }) {
  // State
  const [visibleCount, setVisibleCount] = useState(16);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { ref: loadMoreRef, inView } = useInView();

  // Get from store
  const { viewMode, sortOrder, selectedImage, setSelectedImage, setSortOrder } = useGalleryStore();

  // Memoize filtered and sorted images for better performance
  const images = useMemo(() => {
    let filteredImages: ImageData[] = [];

    // Filter by category
    if (filter === "all") {
      filteredImages = [...allImages];
    } else if (filter === "events") {
      filteredImages = [...eventImages];
    } else if (filter === "success") {
      filteredImages = [...successImages];
    } else if (filter === "others") {
      filteredImages = [...otherImages];
    } else if (filter === "featured") {
      filteredImages = allImages.filter(img => img.featured);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredImages = filteredImages.filter(
        img => img.alt.toLowerCase().includes(query) ||
               img.description.toLowerCase().includes(query)
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filteredImages = filteredImages.filter(img =>
        img.tags?.some(tag => selectedTags.includes(tag))
      );
    }

    // Sort images
    return filteredImages.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOrder === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else { // popular
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
  }, [filter, searchQuery, selectedTags, sortOrder]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(16);
  }, [filter, searchQuery, selectedTags, sortOrder]);
  
  // Automatically load more images when scrolling to the end
  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView]);
  
  // Available tags from all images
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    allImages.forEach(img => {
      img.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, []);
  
  // Load more images
  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 12, images.length));
  };
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Memoize image click handler to prevent re-creating on every render
  const handleImageClick = useCallback((image: ImageData) => {
    setSelectedImage(image);
  }, [setSelectedImage]);

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50 border-muted"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={sortOrder} onValueChange={(value: SortType) => setSortOrder(value)}>
            <SelectTrigger className="w-[180px] bg-background/50">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setShowFilters(!showFilters)}
            className={cn("bg-background/50", showFilters && "border-primary text-primary")}
          >
            <SlidersHorizontal size={18} />
          </Button>
        </div>
      </div>
      
      {/* Tags filter */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-background/40 backdrop-blur-sm rounded-lg border border-border/50 mb-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Tag size={16} /> Filter by tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <Badge 
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer capitalize hover:bg-muted"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Image count information */}
      <div className="text-sm text-muted-foreground">
        Showing {Math.min(visibleCount, images.length)} of {images.length} images
      </div>
      
      {/* Grid or Masonry Layout */}
      {images.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.slice(0, visibleCount).map((image, index) => (
                <GalleryImage
                  key={`${image.id}-${index}`}
                  image={image}
                  index={index}
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </div>
          ) : (
            <Masonry
              breakpointCols={{
                default: 4,
                1100: 3,
                700: 2,
                500: 1
              }}
              className="flex w-auto -ml-4"
              columnClassName="pl-4 bg-clip-padding"
            >
              {images.slice(0, visibleCount).map((image, index) => (
                <GalleryImage
                  key={`${image.id}-${index}`}
                  image={image}
                  index={index}
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </Masonry>
          )}
        
          {/* Invisible load more trigger */}
          {visibleCount < images.length && (
            <div ref={loadMoreRef} className="h-10 w-full" />
          )}
        </>
      ) : (
        <div className="py-20 text-center">
          <p className="text-muted-foreground text-lg">No images match your current filters</p>
          {(searchQuery || selectedTags.length > 0) && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedTags([]);
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}
      
      {/* Image Modal */}
      <ImageModal 
        images={images}
        onNavigate={(direction: number) => {
          if (!selectedImage) return;
          
          const currentIndex = images.findIndex(img => img.id === selectedImage.id);
          if (currentIndex === -1) return;
          
          let newIndex = currentIndex + direction;
          
          // Loop around if at the edges
          if (newIndex < 0) newIndex = images.length - 1;
          if (newIndex >= images.length) newIndex = 0;
          
          setSelectedImage(images[newIndex]);
        }}
      />
    </div>
  );
}

// Generate a simple blur placeholder for images
const generateBlurDataUrl = (id: number): string => {
  const colorHash = Math.abs(id * 13 % 255);
  const r = colorHash % 200;
  const g = (colorHash + 70) % 200;
  const b = (colorHash + 140) % 200;

  const svg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stop-color="rgb(${r},${g},${b})" offset="0%" />
          <stop stop-color="rgb(${r+20},${g+20},${b+20})" offset="100%" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#g${id})" />
    </svg>
  `;

  const toBase64 = (str: string) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str);

  return `data:image/svg+xml;base64,${toBase64(svg)}`;
};

// GalleryImage component with framer-motion and hover effects - memoized for performance
const GalleryImage = memo(function GalleryImage({
  image,
  index,
  onClick
}: {
  image: ImageData,
  index: number,
  onClick: () => void
}) {
  const [isLoading, setIsLoading] = useState(true);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Staggered animation for images
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05, // stagger based on index
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={index}
      className={cn(
        "group relative overflow-hidden rounded-xl mb-4",
        image.width > image.height ? "aspect-video" : 
        image.width === image.height ? "aspect-square" : 
        "aspect-[3/4]"
      )}
      onClick={onClick}
    >
      {/* Glassmorphism hover effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        whileHover={{ opacity: 1 }}
      />
      
      {/* Featured badge */}
      {image.featured && (
        <div className="absolute top-2 right-2 z-20">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-yellow-500/80 backdrop-blur-sm p-1 rounded-full">
                  <Heart size={14} className="text-white" fill="white" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Featured image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
      {/* Image info overlay */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 p-3 z-20 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ y: 10, opacity: 0 }}
        whileHover={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <p className="font-medium truncate text-sm">{image.alt}</p>
        
        <div className="flex items-center gap-1 mt-1 text-xs text-white/80">
          <Calendar size={12} />
          <span>{new Date(image.date).toLocaleDateString()}</span>
        </div>
        
        {image.tags && image.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {image.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-white/20 rounded-full capitalize">
                {tag}
              </span>
            ))}
            {image.tags.length > 2 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-white/20 rounded-full">
                +{image.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </motion.div>
      
      {/* The actual image with enhanced loading */}
      <div className={cn(
        "relative h-full w-full overflow-hidden",
        isLoading ? "bg-muted" : ""
      )}>
        {inView && (
          <>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              placeholder="blur"
              blurDataURL={generateBlurDataUrl(image.id)}
              quality={85}
              className={cn(
                "object-cover w-full h-full transition-all duration-700 ease-out group-hover:scale-105",
                isLoading ? "blur-sm opacity-0 scale-95" : "blur-0 opacity-100 scale-100"
              )}
              onLoadingComplete={() => setIsLoading(false)}
            />
          </>
        )}

        {isLoading && (
          <div className="h-full w-full absolute inset-0">
            <Skeleton className="h-full w-full skeleton-pulse" />
            <div className="absolute inset-0 gradient-shimmer" />
          </div>
        )}
      </div>
    </motion.div>
  );
});
