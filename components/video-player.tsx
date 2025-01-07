import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: {
      Player: new (elementId: string, options: any) => any;
    };
  }
}

interface YouTubePlayerProps {
  videoUrl: string;
  onComplete: () => void;
}

function getYouTubeId(url: string): string | null {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}

export function YouTubePlayer({ videoUrl, onComplete }: YouTubePlayerProps) {
  const [isWatched, setIsWatched] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

    const videoId = getYouTubeId(videoUrl);

    if (!videoId) {
      setError("Invalid YouTube URL");
      return;
    }

    // Initialize YouTube Player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      const newPlayer = new window.YT.Player("youtube-player", {
        height: "390",
        width: "640",
        videoId: videoId,
        playerVars: {
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
      setPlayer(newPlayer);
    };

    return () => {
      if (player && player.destroy) {
        player.destroy();
      }
    };
  }, [videoUrl]);

  useEffect(() => {
    setIsWatched(localStorage.getItem("isWatched") === "true");
  }, []);

  const onPlayerStateChange = (event: any) => {
    // State 0 means video ended
    if (event.data === 0) {
      setIsWatched(true);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative pb-[56.25%] h-0">
        <div
          id="youtube-player"
          className="absolute top-0 left-0 w-full h-full rounded-lg"
        />
      </div>
      {isWatched && (
        <Button
          onClick={onComplete}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Proceed to Personal Discovery
        </Button>
      )}
    </div>
  );
}
