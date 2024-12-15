"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const images = [
  {
    id: 1,
    src: "https://via.placeholder.com/400x300",
    alt: "Mentorship session",
  },
  {
    id: 2,
    src: "https://via.placeholder.com/400x300",
    alt: "Career workshop",
  },
  {
    id: 3,
    src: "https://via.placeholder.com/400x300",
    alt: "Networking event",
  },
  { id: 4, src: "https://via.placeholder.com/400x300", alt: "Success story" },
  { id: 5, src: "https://via.placeholder.com/400x300", alt: "Team building" },
  {
    id: 6,
    src: "https://via.placeholder.com/400x300",
    alt: "Leadership seminar",
  },
];

export function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState<(typeof images)[0] | null>(
    null
  );

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <Dialog key={image.id}>
            <DialogTrigger asChild>
              <div className="cursor-pointer">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover rounded-lg"
                  onClick={() => setSelectedImage(image)}
                />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <Image
                src={image.src}
                alt={image.alt}
                width={800}
                height={600}
                className="w-full h-auto object-contain rounded-lg"
              />
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </>
  );
}
