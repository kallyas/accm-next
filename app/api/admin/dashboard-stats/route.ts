import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [totalUsers, activeMentorships, totalBlogPosts, upcomingEvents] =
      await Promise.all([
        db.user.count(),
        db.mentor.count(),
        db.blogPost.count(),
        db.event.count({ where: { createdAt: { gte: new Date() } } }),
      ]);

    return NextResponse.json({
      totalUsers,
      activeMentorships,
      totalBlogPosts,
      upcomingEvents,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}