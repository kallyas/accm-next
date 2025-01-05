"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export function UserFeedback() {
  const [feedback, setFeedback] = useState("");

  const handleSubmitFeedback = () => {
    // In a real application, you would send this feedback to your backend
    
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback!",
    });
    setFeedback("");
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter your feedback here..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={5}
      />
      <Button onClick={handleSubmitFeedback}>Submit Feedback</Button>
    </div>
  );
}
