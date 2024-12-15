"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export function EmailUsers() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to your backend to send the email
    // For demonstration purposes, we'll just show a toast
    toast({
      title: "Email Sent",
      description: "Your email has been sent to all users.",
    });
    setSubject("");
    setMessage("");
  };

  return (
    <form onSubmit={handleSendEmail} className="space-y-4">
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Send Email to All Users</Button>
    </form>
  );
}
