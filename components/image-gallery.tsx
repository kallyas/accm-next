"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const images = Array(71)
  .fill(0)
  .map((_, index) => ({
    id: index + 1,
    src: `/accm/IMG_${index + 4661}.JPG`,
    alt: `Gallery image ${index + 1}`,
    span: index % 7 === 0 ? "col-span-2" : "row-span-2",
  }));

export function ImageGallery() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images
      .map((image) => (
          <GalleryImage key={image.id} image={image} />
        ))}
    </div>
  );
}

function GalleryImage({ image }: { image: (typeof images)[0] }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={cn(
            "relative cursor-pointer overflow-hidden rounded-lg",
            image.span
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={500}
            height={300}
            className={cn(
              "h-full w-full object-cover transition-all hover:scale-105",
              isLoading
                ? "scale-110 blur-lg grayscale"
                : "scale-100 blur-0 grayscale-0"
            )}
            onLoadingComplete={() => setIsLoading(false)}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Skeleton className="h-full w-full" />
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <Image
          src={image.src}
          alt={image.alt}
          width={1000}
          height={600}
          className="w-full h-auto object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
