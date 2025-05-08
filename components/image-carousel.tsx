"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageData } from '@/types/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageCarouselProps {
  images: ImageData[];
  autoPlay?: boolean;
  interval?: number;
  onSelect?: (image: ImageData) => void;
}

export function ImageCarousel({ 
  images, 
  autoPlay = true, 
  interval = 5000,
  onSelect
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const startAutoPlay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, interval);
    }
  };
  
  useEffect(() => {
    startAutoPlay();
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, images.length]);
  
  const navigate = (direction: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    setCurrentIndex(prev => {
      let newIndex = prev + direction;
      if (newIndex < 0) newIndex = images.length - 1;
      if (newIndex >= images.length) newIndex = 0;
      return newIndex;
    });
    
    startAutoPlay();
  };
  
  return (
    <div className="relative h-80 md:h-96 w-full overflow-hidden rounded-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          onClick={() => onSelect?.(images[currentIndex])}
        >
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            fill
            className="object-cover"
            priority={currentIndex === 0}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-4 md:p-6 text-white">
            <h3 className="text-lg md:text-xl font-bold">{images[currentIndex].alt}</h3>
            <p className="text-sm mt-1 text-white/80 max-w-md">
              {images[currentIndex].description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/30 text-white hover:bg-black/50"
      >
        <ChevronLeft size={20} />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/30 text-white hover:bg-black/50"
      >
        <ChevronRight size={20} />
      </Button>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
            }`}
            onClick={() => {
              setCurrentIndex(index);
              if (timerRef.current) clearInterval(timerRef.current);
              startAutoPlay();
            }}
          />
        ))}
      </div>
    </div>
  );
}
