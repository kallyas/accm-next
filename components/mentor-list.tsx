import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mentors = [
  {
    id: 1,
    name: "Dr. Abel Wilson Walekhwa",
    title: "Founder & Lead Mentor",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    expertise: ["Career Development", "4WFramework", "Leadership"],
    bio: "Dr. Walekhwa is the founder of African Centre for Career Mentorship and developer of the 4WFramework. With over 15 years of experience in career counseling, he has helped thousands of professionals across Africa realize their potential."
  },
  {
    id: 2,
    name: "Sarah Mutesi",
    title: "Technology Mentor",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    expertise: ["Software Development", "AI/ML", "Tech Entrepreneurship"],
    bio: "Sarah is a tech industry veteran with experience at top Silicon Valley companies. She specializes in guiding aspiring tech professionals and entrepreneurs in navigating the rapidly evolving tech landscape."
  },
  {
    id: 3,
    name: "Oluwaseun Adebayo",
    title: "Business Strategy Mentor",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    expertise: ["Business Development", "Marketing", "Entrepreneurship"],
    bio: "Oluwaseun brings 20 years of experience in business strategy and entrepreneurship. He has successfully launched and scaled multiple businesses across West Africa and is passionate about nurturing the next generation of African entrepreneurs."
  }
]

export function MentorList() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mentors.map((mentor) => (
        <Card key={mentor.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Image
                src={mentor.image}
                alt={mentor.name}
                width={80}
                height={80}
                className="rounded-full"
              />
              <div>
                <CardTitle>{mentor.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{mentor.title}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <p className="text-sm mb-4 flex-grow">{mentor.bio}</p>
            <div className="flex flex-wrap gap-2">
              {mentor.expertise.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

