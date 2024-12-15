import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestimonialSlider } from "@/components/testimonial-slider";
import { StatisticsSection } from "@/components/statistics-section";
import { FeaturedMentors } from "@/components/featured-mentors";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              African Centre for Career Mentorship
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Empowering professionals across Africa through expert mentorship
              and career development.
            </p>
            <div className="space-x-4">
              <Link href="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
              <Link href="/book-session">
                <Button size="lg" variant="outline">
                  Book a Session
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container py-12 space-y-8">
          <h2 className="text-3xl font-bold text-center">Our Services</h2>
          <Tabs defaultValue="mentorship" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
              <TabsTrigger value="workshops">Workshops</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            <TabsContent value="mentorship">
              <Card>
                <CardHeader>
                  <CardTitle>One-on-One Mentorship</CardTitle>
                  <CardDescription>
                    Personalized guidance from industry experts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Our mentorship program pairs you with experienced
                    professionals who provide tailored advice and support for
                    your career journey.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="workshops">
              <Card>
                <CardHeader>
                  <CardTitle>Career Development Workshops</CardTitle>
                  <CardDescription>
                    Skill-building sessions for professional growth
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Participate in interactive workshops designed to enhance
                    your skills in areas such as leadership, communication, and
                    industry-specific knowledge.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle>Career Resources Library</CardTitle>
                  <CardDescription>
                    Comprehensive materials for self-paced learning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Access our extensive library of e-books, video courses, and
                    articles covering various aspects of career development and
                    industry insights.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <StatisticsSection />

        <section className="container py-12 space-y-8">
          <h2 className="text-3xl font-bold text-center">Featured Mentors</h2>
          <FeaturedMentors />
        </section>

        <section className="bg-secondary py-12 px-4 rounded-lg text-white">
          <div className="container space-y-8">
            <h2 className="text-3xl font-bold text-center">Success Stories</h2>
            <TestimonialSlider />
          </div>
        </section>

        <section className="container py-12 space-y-8">
          <h2 className="text-3xl font-bold text-center">Join Our Community</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                src="https://via.placeholder.com/600x400"
                alt="Community event"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <p className="text-lg">
                Become part of a thriving community of professionals dedicated
                to growth and success. Network with peers, share experiences,
                and collaborate on projects.
              </p>
              <Link href="/register">
                <Button size="lg">Join Now</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
