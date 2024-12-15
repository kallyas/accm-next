"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type ProgressItem = {
  id: string;
  name: string;
  progress: number;
};

export function UserProgress() {
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([
    { id: "1", name: "Career Development Course", progress: 60 },
    { id: "2", name: "Leadership Skills", progress: 40 },
    { id: "3", name: "Networking Proficiency", progress: 75 },
  ]);

  return (
    <div className="space-y-6">
      {progressItems.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>{item.progress}% Complete</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={item.progress} className="w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
