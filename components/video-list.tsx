"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoModal } from "@/components/video-modal";

type Video = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoId: string;
};

type VideoListProps = {
  videos: Video[];
};

export function VideoList({ videos }: VideoListProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <Card
          key={video.id}
          className="cursor-pointer"
          onClick={() => handleVideoClick(video)}
        >
          <CardHeader>
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-40 object-cover rounded-t-lg"
            />
          </CardHeader>
          <CardContent>
            <CardTitle className="mb-2">{video.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{video.description}</p>
          </CardContent>
        </Card>
      ))}
      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={handleCloseModal}
          videoId={selectedVideo.videoId}
          title={selectedVideo.title}
        />
      )}
    </div>
  );
}
