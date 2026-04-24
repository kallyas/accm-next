"use client";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ProfileForm } from "@/components/profile-form";
import { AvatarUpload } from "@/components/avatar-upload";
import { db } from "@/lib/db";
import { getR2Url } from "@/lib/cloudflare-r2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Image as ImageIcon, Sparkles } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  const user = await db.user.findUnique({
    where: { id: session!.user!.id },
    include: { profile: true },
  });

  let userAvatar = null;
  if (user?.profile?.avatar) {
    userAvatar = await getR2Url(user.profile.avatar);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#26A649]">
          <Sparkles className="mr-2 h-3.5 w-3.5 inline" />
          Account
        </p>
        <h1 className="text-2xl font-semibold uppercase tracking-tight text-[#1A1B4B] sm:text-3xl">
          Profile Settings
        </h1>
        <p className="text-sm text-[#1A1B4B]/60">
          Manage your profile information and account settings
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border border-[#1A1B4B]/20 bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-[#1A1B4B]/50" />
              <CardTitle className="text-sm uppercase tracking-wider text-[#1A1B4B]">
                Profile Picture
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <AvatarUpload user={user!} userAvatar={userAvatar} />
              <div className="text-xs text-[#1A1B4B]/60 bg-[#ece8df]/50 p-4">
                <h4 className="font-medium text-[#1A1B4B] mb-2">Requirements</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>At least 400x400 pixels</li>
                  <li>Maximum size of 5MB</li>
                  <li>JPG, PNG, or GIF format</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#1A1B4B]/20 bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#1A1B4B]/50" />
              <CardTitle className="text-sm uppercase tracking-wider text-[#1A1B4B]">
                Personal Information
              </CardTitle>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="px-6 py-6">
            <ProfileForm user={user!} />
          </CardContent>
        </Card>

        <Card className="border border-[#1A1B4B]/10 bg-[#ece8df]/30">
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs uppercase tracking-wider text-[#1A1B4B]">
                Profile Completion
              </CardTitle>
              <span className="text-xs font-medium text-[#1A1B4B]">70%</span>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="text-center text-xs text-[#1A1B4B]/50">
        <p>
          Your profile information helps us personalize your experience.
        </p>
      </div>
    </div>
  );
}