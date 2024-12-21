import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mentors = [
  {
    name: "Dr. Abel Wilson Walekhwa",
    role: "Founder & Lead Mentor",
    image: "/mentors/banner-image.jpeg",
    expertise: "Career Development, Leadership",
  },
  {
    name: "Birungi Evelyne",
    role: "Learning and Development Specialist",
    image: "/mentors/picture2.png",
    expertise: "financial literacy, Trainer of trainees.",
  },
  {
    name: "Harriet Ocitti",
    role: "A proficient and passionate communication coach",
    image: "/mentors/harriet.jpg",
    expertise: "public speaking, leadership skills",
  },
];

export function FeaturedMentors() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mentors.map((mentor) => (
        <Card key={mentor.name}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Image
                src={mentor.image}
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
