"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const videos = [
  {
    id: 1,
    title: "Introduction to the 4WFramework",
    duration: "10:30",
    thumbnail: "https://via.placeholder.com/300x200",
  },
  {
    id: 2,
    title: "Effective Networking Strategies",
    duration: "15:45",
    thumbnail: "https://via.placeholder.com/300x200",
  },
  {
    id: 3,
    title: "Mastering the Job Interview",
    duration: "20:15",
    thumbnail: "https://via.placeholder.com/300x200",
  },
]

export function VideoList({ userEmail }: { userEmail?: string | null }) {
  const [progress, setProgress] = useState<Record<number, number>>({})

  useEffect(() => {
    // In a real application, you would fetch the user's progress from your backend
    const fetchProgress = async () => {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProgress({
        1: 75,
        2: 30,
        3: 0,
      })
    }
    fetchProgress()
  }, [userEmail])

  const handleVideoClick = (videoId: number) => {
    // In a real application, you would navigate to the video player page
    console.log(`Playing video ${videoId}`)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <Card key={video.id} className="cursor-pointer" onClick={() => handleVideoClick(video.id)}>
          <CardHeader>
            <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover rounded-t-lg" />
          </CardHeader>
          <CardContent>
            <CardTitle className="mb-2">{video.title}</CardTitle>
            <p className="text-sm text-muted-foreground mb-2">Duration: {video.duration}</p>
            <Progress value={progress[video.id] || 0} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              {progress[video.id] ? `${progress[video.id]}% completed` : "Not started"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

