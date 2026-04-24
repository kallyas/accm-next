"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { VideoModal } from "@/components/video-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Video = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoId: string;
  duration?: string;
  category?: string;
};

type VideoListProps = {
  videos: Video[];
};

function VideoCard({
  video,
  index,
  onClick,
}: {
  video: Video;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={cn(
        "group cursor-pointer",
        index % 3 === 1 ? "md:translate-y-8" : "",
        index % 3 === 2 ? "md:-translate-y-4" : ""
      )}
      onClick={onClick}
    >
      <div className="border border-[#1A1B4B]/20 bg-[#FFFFFF]  ">
        <div className="relative aspect-[16/10] overflow-hidden">
          {video.thumbnailUrl ? (
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-[#1A1B4B]/5 ">
              <div className="flex h-full items-center justify-center">
                <span className="text-4xl font-semibold text-[#1A1B4B]/60 ">
                  {video.category?.[0] || "V"}
                </span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-[#1A1B4B]/40 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center bg-[#FFFFFF] ">
              <Play className="ml-1 h-5 w-5 text-[#1A1B4B] " fill="currentColor" />
            </div>
          </div>
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-[#1A1B4B]/10 px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-[#FFFFFF]">
              {video.duration}
            </div>
          )}
        </div>
        <div className="p-5">
          {video.category && (
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#1A1B4B]/70 ">
              {video.category}
            </p>
          )}
          <h3 className="mt-2 text-base font-semibold uppercase leading-tight">
            {video.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#1A1B4B]  line-clamp-2">
            {video.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export function VideoList({ videos }: VideoListProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video, index) => (
          <VideoCard
            key={video.id}
            video={video}
            index={index}
            onClick={() => handleVideoClick(video)}
          />
        ))}
      </div>
      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={handleCloseModal}
          videoId={selectedVideo.videoId}
          title={selectedVideo.title}
        />
      )}
    </>
  );
}