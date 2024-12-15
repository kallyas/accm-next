import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mentors = [
  {
    name: "Dr. Abel Wilson Walekhwa",
    role: "Founder & Lead Mentor",
    image: "/placeholder.svg?height=100&width=100",
    expertise: "Career Development, Leadership",
  },
  {
    name: "Sarah Mutesi",
    role: "Technology Mentor",
    image: "/placeholder.svg?height=100&width=100",
    expertise: "Software Development, AI/ML",
  },
  {
    name: "Oluwaseun Adebayo",
    role: "Business Strategy Mentor",
    image: "/placeholder.svg?height=100&width=100",
    expertise: "Entrepreneurship, Marketing",
  },
];

export function FeaturedMentors() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mentors.map((mentor, index) => (
        <Card key={mentor.name}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Image
                src={`https://randomuser.me/api/portraits/${
                  index % 2 === 0 ? "women" : "men"
                }/${index}.jpg`}
                alt={mentor.name}
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <CardTitle className="text-lg">{mentor.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{mentor.role}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Expertise: {mentor.expertise}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
