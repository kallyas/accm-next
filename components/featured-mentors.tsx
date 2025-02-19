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
    image: "/mentors/Picture2.png",
    expertise: "Financial Literacy, Trainer of Trainees",
  },
  {
    name: "Harriet Ocitti",
    role: "A Proficient and Passionate Communication Coach",
    image: "/mentors/harriet.jpg",
    expertise: "Public Speaking, Leadership Skills",
  },
];

export function FeaturedMentors() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {mentors.map((mentor) => (
        <Card
          key={mentor.name}
          className="group hover:shadow-2xl transition-all duration-300 overflow-hidden shadow-md"
        >
          <CardHeader className="relative p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full opacity-75 group-hover:opacity-100 transition-opacity blur-md"></div>
                <Image
                  src={mentor.image}
                  alt={mentor.name}
                  width={80}
                  height={80}
                  className="rounded-full relative bg-white dark:bg-gray-900"
                />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl md:text-2xl bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent font-semibold">
                  {mentor.name}
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {mentor.role}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
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
