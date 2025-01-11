import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ProfileForm } from "@/components/profile-form";
import { AvatarUpload } from "@/components/avatar-upload";
import { db } from "@/lib/db";
import { getR2Url } from "@/lib/cloudflare-r2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, ImageIcon } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="space-y-3 pb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Profile Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your profile information and account settings
          </p>
        </div>

        <div className="grid gap-10">
          {/* Avatar Section */}
          <Card className="overflow-hidden">
            <CardHeader className="space-y-2 px-6 py-5">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
                <CardTitle>Profile Picture</CardTitle>
              </div>
              <CardDescription className="text-base">
                Upload a profile picture to personalize your account
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-6">
              <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
                <div className="relative flex-shrink-0">
                  <AvatarUpload user={user!!} userAvatar={userAvatar} />
                </div>
                <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">
                    Photo requirements
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5">
                    <li>At least 400x400 pixels</li>
                    <li>Maximum size of 5MB</li>
                    <li>JPG, PNG, or GIF format</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information Section */}
          <Card>
            <CardHeader className="space-y-2 px-6 py-5">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-muted-foreground" />
                <CardTitle>Personal Information</CardTitle>
              </div>
              <CardDescription className="text-base">
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="px-6 py-6">
              <ProfileForm user={user!!} />
            </CardContent>
          </Card>

          {/* Activity Section */}
          <Card className="bg-muted/50">
            <CardHeader className="px-6 py-5 space-y-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Profile Completion
                </CardTitle>
                <span className="text-sm font-medium">70%</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted">
                <div
                  className="h-full w-[70%] rounded-full bg-primary transition-all duration-300"
                  role="progressbar"
                  aria-valuenow={70}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Complete your profile to improve your visibility
              </p>
            </CardHeader>
          </Card>
        </div>

        {/* Footer Section */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p className="max-w-2xl mx-auto px-4">
            Your profile information helps us personalize your experience. All
            data is handled according to our{" "}
            <a
              href="/privacy"
              className="underline hover:text-foreground transition-colors duration-200"
            >
              privacy policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
