"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PersonalDiscoveryData } from "@/types/general";
import Link from "next/link";

export function PersonalDiscovery({
  personalDiscovery,
}: {
  personalDiscovery: PersonalDiscoveryData | null;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (!personalDiscovery) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personal Discovery</CardTitle>
          <CardDescription>
            You haven't completed your personal discovery yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard/personal-discovery/start">
              Start Personal Discovery
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const sections = [
    { title: "Strengths", data: personalDiscovery.strengths },
    { title: "Weaknesses", data: personalDiscovery.weaknesses },
    { title: "Opportunities", data: personalDiscovery.opportunities },
    { title: "Achievements", data: personalDiscovery.achievements },
    { title: "Threats", data: personalDiscovery.threats },
    { title: "Family Aspirations", data: personalDiscovery.familyAspirations },
    { title: "Career Aspirations", data: personalDiscovery.careerAspirations },
    {
      title: "Financial/Business Aspirations",
      data: personalDiscovery.financialBusinessAspirations,
    },
    { title: "Social Aspirations", data: personalDiscovery.socialAspirations },
    { title: "Desired Position", data: personalDiscovery.desiredPosition },
    { title: "Required Skills", data: personalDiscovery.requiredSkills },
    {
      title: "Courses and Trainings",
      data: personalDiscovery.coursesAndTrainings,
    },
    { title: "Strategies", data: personalDiscovery.strategies },
    { title: "Short-term Goals", data: personalDiscovery.shortTermGoals },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Discovery</CardTitle>
        <CardDescription>Your personal discovery information</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {sections.map((section, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{section.title}</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6">
                  {section.data.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button className="mt-4" onClick={() => setIsEditing(true)}>
          Edit Personal Discovery
        </Button>
      </CardContent>
    </Card>
  );
}
