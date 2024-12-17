import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ServiceList } from "@/components/service-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Users,
  GraduationCap,
  FileText,
  Search,
  MessageSquare,
  Video,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { SubscribePlan } from "@/components/user/subscribe-plan";

export default async function ServicesPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Our Services</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Comprehensive career development and mentorship services to help you
        achieve your professional goals.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Human Capital Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Leadership</li>
              <li>Change Management</li>
              <li>Excellence at workplaces</li>
              <li>Career Goal Setting</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              International Scholarships Coaching
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Gold Package (6 months)</li>
              <li>Silver Package (3 months)</li>
              <li>Weekly webinars (Tuesday 7-8pm/ Ugandan time)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Research & Writing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Research Proposal Writing</li>
              <li>Grants Writing</li>
              <li>Scientific Writing Coaching</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Preparation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>CV Alignment</li>
              <li>Personal Statement Writing</li>
              <li>Motivation Letter</li>
              <li>Cover Letter</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Career Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Career Guidance</li>
              <li>Personal Discovery</li>
              <li>Career Path Planning</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Interview Preparation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Mock Interviews</li>
              <li>Interview Techniques</li>
              <li>Question Preparation</li>
              <li>Feedback Sessions</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        {!session && (
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Services</h2>
        )}
        <SubscribePlan />
        {!session && (
          <div className="mt-8">
            <Link href="/login">
              <Button>Login to Subscribe</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
