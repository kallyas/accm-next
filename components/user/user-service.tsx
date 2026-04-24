"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Service = {
  id: string;
  name: string;
  description: string;
};

export function UserServices() {
  const [services] = useState<Service[]>([
    {
      id: "1",
      name: "1-on-1 Mentorship",
      description: "Weekly mentorship sessions with an industry expert",
    },
    {
      id: "2",
      name: "Career Resources",
      description: "Access to our library of career development resources",
    },
    {
      id: "3",
      name: "Networking Events",
      description: "Exclusive invitations to our networking events",
    },
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Card key={service.id} className="border-[#1A1B4B]/20 bg-[#FFFFFF]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1A1B4B]">
              <Sparkles className="h-4 w-4 text-[#26A649]" />
              {service.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-[#1A1B4B]/60">
              {service.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
