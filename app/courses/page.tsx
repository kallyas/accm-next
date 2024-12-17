import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { CourseCard } from "@/components/course-card"

export default async function CoursesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/courses")}`)
  }

  const courses = await db.course.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      level: true,
      duration: true,
    },
  })

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Available Courses</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}

