"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import LoadingText from "./loading-text";

type AvatarUploadProps = {
  user: User & { profile: { avatar: string | null } | null };
  userAvatar: string | null;
};

export function AvatarUpload({ user, userAvatar }: AvatarUploadProps) {
  const [avatar, setAvatar] = useState<string | null>(userAvatar || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload avatar");
      }

      const data = await response.json();
      setAvatar(data.avatarUrl);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been successfully updated.",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-32 h-32">
        <AvatarImage
          src={avatar || undefined}
          alt={`${user.firstName} ${user.lastName}`}
        />
        <AvatarFallback>
          {user.firstName[0]}
          {user.lastName[0]}
        </AvatarFallback>
      </Avatar>
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="max-w-xs"
      />
      <LoadingText isUploading={isUploading} />
    </div>
  );
}
