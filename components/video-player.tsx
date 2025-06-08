import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

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
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    // Check if video was already watched
    const savedWatchState = localStorage.getItem("isWatched") === "true";
    setIsWatched(savedWatchState);

    // If already watched, immediately call onComplete
    if (savedWatchState) {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    const videoId = getYouTubeId(videoUrl);

    if (!videoId) {
      setError("Invalid YouTube URL");
      return;
    }

    // Check if YouTube API is already loaded
    if (window.YT && window.YT.Player) {
      initializePlayer(videoId);
      return;
    }

    // Load YouTube IFrame API if not already loaded
    if (
      !document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      )
    ) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Initialize YouTube Player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
      initializePlayer(videoId);
    };

    return () => {
      if (player && player.destroy) {
        player.destroy();
      }
    };
  }, [videoUrl]);

  const initializePlayer = (videoId: string) => {
    try {
      const newPlayer = new window.YT.Player("youtube-player", {
        height: "100%",
        width: "100%",
        videoId: videoId,
        playerVars: {
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          fs: 1,
          cc_load_policy: 1,
          iv_load_policy: 3,
          autohide: 0,
        },
        events: {
          onStateChange: onPlayerStateChange,
          onError: onPlayerError,
        },
      });
      setPlayer(newPlayer);
    } catch (error) {
      console.error("Failed to initialize YouTube player:", error);
      setError("Failed to load video player");
    }
  };

  const onPlayerStateChange = (event: any) => {
    // State 0 means video ended
    if (event.data === 0) {
      handleVideoComplete();
    }
  };

  const onPlayerError = (event: any) => {
    console.error("YouTube player error:", event);
    setError("Failed to load video. Please try refreshing the page.");
  };

  const handleVideoComplete = () => {
    setIsWatched(true);
    localStorage.setItem("isWatched", "true");
    onComplete(); // Call the callback immediately when video completes
  };

  const handleManualComplete = () => {
    handleVideoComplete();
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
      <div className="relative pb-[56.25%] h-0 bg-gray-900 rounded-lg overflow-hidden">
        <div
          id="youtube-player"
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>

      {isWatched ? (
        <div className="flex items-center justify-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-800 dark:text-green-200">
            Video completed! You can now proceed to the questionnaire.
          </span>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Watch the complete video to unlock the questionnaire
          </p>
          <Button onClick={handleManualComplete} variant="outline" size="sm">
            Mark as Complete
          </Button>
        </div>
      )}
    </div>
  );
}
