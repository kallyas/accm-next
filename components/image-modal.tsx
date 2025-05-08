"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Download,
  X,
  Share2,
  Info,
  Calendar,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageData } from "@/types/types";
import { useGalleryStore } from "@/stores/gallery-store";

export function ImageModal({
  images,
  onNavigate,
}: {
  images: ImageData[];
  onNavigate: (direction: number) => void;
}) {
  const { selectedImage, setSelectedImage } = useGalleryStore();
  const [imageStates, setImageStates] = useState<Record<number, { isLoaded: boolean, isError: boolean }>>({});
  const [showInfo, setShowInfo] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [previousImage, setPreviousImage] = useState<ImageData | null>(null);
  const [preloadIndexes, setPreloadIndexes] = useState<number[]>([]);
  const [blurDataUrls, setBlurDataUrls] = useState<Record<number, string>>({});

  // Get current image index for pagination display
  const currentIndex = selectedImage 
    ? images.findIndex((img) => img.id === selectedImage.id)
    : -1;

  // Save previous image for transition effect
  useEffect(() => {
    if (selectedImage && (!previousImage || previousImage.id !== selectedImage.id)) {
      setPreviousImage(selectedImage);
    }
  }, [selectedImage, previousImage]);

  // Preload adjacent images
  useEffect(() => {
    if (currentIndex > -1) {
      const nextIndex = (currentIndex + 1) % images.length;
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      setPreloadIndexes([nextIndex, prevIndex]);
    }
  }, [currentIndex, images.length]);

  // Generate blur data URLs for images that don't have them
  useEffect(() => {
    const generateBlurDataUrl = async (imageId: number, src: string) => {
      if (blurDataUrls[imageId]) return;
      
      // Create a simple blur placeholder (could be enhanced with proper color extraction)
      const colorHash = Math.abs(imageId * 11 % 255); // Simple hash for different colors
      const r = colorHash % 200;
      const g = (colorHash + 70) % 200;
      const b = (colorHash + 140) % 200;
      
      // Create a simple SVG with a gradient as placeholder
      const svg = `
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop stop-color="rgb(${r},${g},${b})" offset="0%" />
              <stop stop-color="rgb(${r+20},${g+20},${b+20})" offset="100%" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#g)" />
        </svg>
      `;
      
      const toBase64 = (str: string) => 
        typeof window === 'undefined'
          ? Buffer.from(str).toString('base64')
          : window.btoa(str);
      
      const blurDataUrl = `data:image/svg+xml;base64,${toBase64(svg)}`;
      
      setBlurDataUrls(prev => ({
        ...prev,
        [imageId]: blurDataUrl
      }));
    };
    
    if (selectedImage) {
      generateBlurDataUrl(selectedImage.id, selectedImage.src);
    }
    
    preloadIndexes.forEach(index => {
      if (index >= 0 && index < images.length) {
        generateBlurDataUrl(images[index].id, images[index].src);
      }
    });
  }, [selectedImage, preloadIndexes, images, blurDataUrls]);

  // Handle image loading
  const handleImageLoad = (id: number) => {
    setImageStates(prev => ({
      ...prev,
      [id]: { isLoaded: true, isError: false }
    }));
    
    // If this is the current image, stop navigation state
    if (selectedImage && id === selectedImage.id) {
      setTimeout(() => {
        setIsNavigating(false);
      }, 300); // Add a small delay for smoother transition
    }
  };

  // Handle image error
  const handleImageError = (id: number) => {
    setImageStates(prev => ({
      ...prev,
      [id]: { isLoaded: false, isError: true }
    }));
    
    if (selectedImage && id === selectedImage.id) {
      setIsNavigating(false);
    }
  };

  // Enhanced navigation with loading state
  const handleNavigate = (direction: number) => {
    if (!selectedImage || isNavigating) return;
    
    setIsNavigating(true);
    onNavigate(direction);
  };

  // Check if current image is loaded
  const isCurrentImageLoaded = selectedImage 
    ? imageStates[selectedImage.id]?.isLoaded 
    : false;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      if (e.key === 'ArrowLeft') {
        handleNavigate(-1);
      } else if (e.key === 'ArrowRight') {
        handleNavigate(1);
      } else if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage, setSelectedImage]);

  if (!selectedImage) return null;

  // Get blur data URL for the current image
  const currentBlurDataUrl = blurDataUrls[selectedImage.id] || null;

  return (
    <Dialog
      open={!!selectedImage}
      onOpenChange={(open) => !open && setSelectedImage(null)}
    >
      <DialogContent className="sm:max-w-5xl md:max-w-6xl max-h-[90vh] p-0 overflow-hidden bg-background/95 border-border/50 backdrop-blur-md shadow-2xl">
        <div className="relative h-full flex flex-col">
          {/* Top controls */}
          <div className="absolute top-2 right-2 z-50 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInfo(!showInfo)}
              className={cn(
                "text-white hover:bg-white/20 rounded-full",
                showInfo && "bg-white/20"
              )}
            >
              <Info size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedImage(null)}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X size={18} />
            </Button>
          </div>

          {/* Image container */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-2 md:p-4">
            {/* Left navigation */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigate(-1)}
              disabled={isNavigating}
              className="absolute left-4 z-30 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm h-10 w-10"
            >
              <ChevronLeft size={22} className={cn(
                "transition-opacity duration-200",
                isNavigating && "opacity-50"
              )} />
            </Button>

            {/* The image */}
            <div className="relative max-h-[calc(90vh-150px)] w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative max-h-full max-w-full mx-auto"
                >
                  {/* Shimmer effect placeholder */}
                  <div className={cn(
                    "absolute inset-0 overflow-hidden rounded-md transition-opacity duration-500",
                    isCurrentImageLoaded ? "opacity-0" : "opacity-100"
                  )}>
                    {currentBlurDataUrl ? (
                      <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${currentBlurDataUrl})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-effect" />
                      </div>
                    ) : (
                      <Skeleton className="h-full w-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-effect" />
                      </Skeleton>
                    )}
                  </div>
                  
                  {/* Main image that fades in */}
                  <Image
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    width={1200}
                    height={800}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    quality={90}
                    priority={true}
                    placeholder={currentBlurDataUrl ? "blur" : "empty"}
                    blurDataURL={currentBlurDataUrl || undefined}
                    className={cn(
                      "max-h-[calc(90vh-150px)] max-w-full object-contain mx-auto transition-opacity duration-500",
                      isCurrentImageLoaded ? "opacity-100" : "opacity-0"
                    )}
                    onLoadingComplete={() => handleImageLoad(selectedImage.id)}
                    onError={() => handleImageError(selectedImage.id)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right navigation */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigate(1)}
              disabled={isNavigating}
              className="absolute right-4 z-30 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm h-10 w-10"
            >
              <ChevronRight size={22} className={cn(
                "transition-opacity duration-200",
                isNavigating && "opacity-50"
              )} />
            </Button>

            {/* Pagination indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs text-white">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Preload next and previous images */}
          <div className="sr-only">
            {preloadIndexes.map(index => (
              <Image
                key={`preload-${images[index].id}`}
                src={images[index].src}
                alt="Preloaded image"
                width={10}
                height={10}
                onLoadingComplete={() => handleImageLoad(images[index].id)}
                onError={() => handleImageError(images[index].id)}
              />
            ))}
          </div>

          {/* Image information panel */}
          <AnimatePresence>
            <motion.div
              className="p-4 md:p-6 pt-3 bg-background border-t border-border/30"
              initial={
                showInfo ? { height: "auto" } : { height: 0, opacity: 0 }
              }
              animate={
                showInfo
                  ? { height: "auto", opacity: 1 }
                  : { height: 0, opacity: 0 }
              }
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="overflow-hidden">
                <DialogTitle className="text-xl font-medium mb-2">
                  {selectedImage.alt}
                </DialogTitle>

                <DialogDescription className="text-sm text-muted-foreground">
                  {selectedImage.description}
                </DialogDescription>

                <div className="mt-4 flex flex-wrap gap-y-3 gap-x-6 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span>
                      {new Date(selectedImage.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Tag size={16} className="text-muted-foreground" />
                    <span className="capitalize">{selectedImage.category}</span>
                  </div>

                  {selectedImage.featured && (
                    <div className="text-yellow-500 flex items-center gap-1.5">
                      <span className="flex h-2 w-2 rounded-full bg-yellow-500"></span>
                      <span>Featured</span>
                    </div>
                  )}
                </div>

                {selectedImage.tags && selectedImage.tags.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedImage.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-muted rounded-full text-xs capitalize"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Footer with actions */}
          <div className="p-4 border-t border-border/30 flex items-center justify-between gap-2 bg-muted/30">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9"
                onClick={() => window.open(selectedImage.src, '_blank')}
              >
                <ZoomIn className="h-4 w-4 mr-1" /> View Full Size
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = selectedImage.src;
                  link.download = `${selectedImage.alt.replace(/\s+/g, '-').toLowerCase()}.jpg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="h-9"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: selectedImage.alt,
                    text: selectedImage.description,
                    url: window.location.href,
                  }).catch(console.error);
                } else {
                  navigator.clipboard.writeText(window.location.href)
                    .then(() => {
                      alert("Link copied to clipboard!");
                    })
                    .catch(console.error);
                }
              }}
            >
              <Share2 className="h-4 w-4 mr-1" /> Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
