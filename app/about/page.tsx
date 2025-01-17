import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">About African Centre For Career Mentorship</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-lg mb-4">
            African Centre For Career Mentorship is a sustainable center of excellence for career
            mentorship, dedicated to empowering professionals across Africa
            through expert guidance and innovative career development programs.
          </p>
          <p className="text-lg mb-4">
            Founded by Abel Wilson Walekhwa, our mission is to bridge the
            gap between education and industry needs, fostering a new generation
            of skilled and confident professionals ready to take on the
            challenges of the modern workplace.
          </p>
          <p className="text-lg">
            Through our unique 4WFramework and personalized mentorship approach,
            we&apos;ve helped thousands of individuals unlock their potential and
            achieve their career goals.
          </p>
        </div>
        <Image
          src="/accm/IMG_4727.JPG"
          alt="Team at African Centre For Career Mentorship"
          width={600}
          height={400}
          className="rounded-lg"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 mb-12 mt-10">
        <Card>
          <CardHeader>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              A sustainable centre of excellence for Career Mentorship and Human
              Capital Development in Africa.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              To set up a functional and Sustainable Centre of Excellence for
              Career Mentorship and Human Capital Development in Uganda by
              December 2025.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goal Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Our Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            To equip youths and professionals with growing and changing job
            market skills and support them their full potentials for
            socio-economic transformation of Africa.
          </p>
        </CardContent>
      </Card>

      {/* Values Section */}
      <h2 className="text-3xl font-bold mt-10 mb-6">Our Core Values</h2>
      <div className="grid gap-6 md:grid-cols-4 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Professionalism</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              We maintain the highest standards of professional conduct in all
              our interactions.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Research</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              We base our approaches on thorough research and evidence-based
              practices.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Excellence</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              We strive for excellence in all our programs and services.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Collaboration</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              We believe in the power of working together to achieve greater
              impact.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Objectives Section */}
      <h2 className="text-3xl font-bold mb-6">Specific Objectives</h2>
      <div className="space-y-4 mb-12">
        {[
          "To grow a sustainable and accountable organization by December 2025.",
          "To design and implement professional Human Capital Development program for over 300 staff from 10 different organizations by December 2024.",
          "To develop a two-career mentorship curricular for Science, Technology, Engineering and Mathematics and Humanities students leaving universities and colleges in Uganda by June 2024.",
          "To set up one carrier mentorship Centre For both STEM and Humanities students leaving universities and colleges in Uganda by December 2023.",
          "To initiate a career mentorship services for both STEM and Humanities students from Kampala metropolitan area from 0 to 2M by December 2024.",
          "To advance Career services for 1M students in 10 academic institutions and universities in Kampala metropolitan area by December 2025.",
        ].map((objective, index) => (
          <div key={index} className="flex items-start gap-4">
            <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
            <p className="text-lg">{objective}</p>
          </div>
        ))}
      </div>

      {/* Impact Section */}
      <h2 className="text-3xl font-bold mb-6">Our Impact</h2>
      <div className="grid gap-6 md:grid-cols-2 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Previous Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              1. Conducted a Leadership and Change Management training at Give
              Directly, Uganda, December 2023
            </p>
            <p>
              2. Excellence at work, Career Visualization and Conflicts
              resolution at African Youth Action Network, July, 2023 and January
              2024
            </p>
            <p>
              3. International Coaching for professionals with success rate of
              98.1% admission stage and scholarship at 82.7% for 2023-24
            </p>
            <p>
              4. Youth empowered leadership and entrepreneurship inaugural
              project, July-September 2023
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Community Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              1. Contributed to education services access through Nalusaga Young
              Persons Savings and Cooperative Society LTD, Himutu Subcounty,
              Butaleja District (REG NO P9392/RCS) (USD 4,174)
            </p>
            <p>
              2. Supported girl child school retention project at Butaleja
              Technical Institute, 2023 (USD 55.5)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
