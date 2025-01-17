import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mentors = [
  {
    name: "Abel Wilson Walekhwa",
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
        <Card
          key={mentor.name}
          className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          <CardHeader className="relative">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full opacity-75 group-hover:opacity-100 transition-opacity blur"></div>
                <Image
                  src={mentor.image}
                  alt={mentor.name}
                  width={50}
                  height={50}
                  className="rounded-full relative bg-white dark:bg-gray-900"
                />
              </div>
              <div>
                <CardTitle className="text-lg bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                  {mentor.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground font-medium">
                  {mentor.role}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium text-muted-foreground">
                  Expertise:{" "}
                </span>
                <span className="text-foreground">{mentor.expertise}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
