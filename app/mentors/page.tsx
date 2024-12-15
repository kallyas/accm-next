import { MentorList } from "@/components/mentor-list"

export default function MentorsPage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Our Mentors</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Meet our experienced mentors who are dedicated to guiding you through your career journey.
      </p>
      <MentorList />
    </div>
  )
}

