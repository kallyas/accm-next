"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
};

const services: Service[] = [
  {
    id: 1,
    name: "Basic Mentorship",
    description: "One-on-one mentorship sessions with experienced professionals",
    price: 50,
    features: ["Monthly 1-hour session", "Career guidance", "Resume review"],
  },
  {
    id: 2,
    name: "Premium Career Development",
    description: "Comprehensive career development program with multiple mentors",
    price: 100,
    features: [
      "Weekly 1-hour sessions",
      "Personalized career plan",
      "Skills assessment",
      "Job search assistance",
    ],
  },
  {
    id: 3,
    name: "Executive Leadership",
    description: "Intensive program for aspiring and current executives",
    price: 200,
    features: [
      "Bi-weekly 2-hour sessions",
      "Leadership skills development",
      "Networking opportunities",
      "Executive coaching",
    ],
  },
];

function ServiceCard({
  service,
  index,
  onSubscribe,
  isSubscribing,
}: {
  service: Service;
  index: number;
  onSubscribe: () => void;
  isSubscribing: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={cn(
        "group",
        index % 3 === 1 ? "md:translate-y-8" : "",
        index % 3 === 2 ? "md:-translate-y-4" : ""
      )}
    >
      <div className="border border-[#1A1B4B]/20 bg-[#FFFFFF] p-5  ">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#1A1B4B]/70 ">
          Plan {index + 1}
        </p>
        <h3 className="mt-2 text-base font-semibold uppercase leading-tight">
          {service.name}
        </h3>
        <p className="mt-3 text-sm leading-6 text-[#1A1B4B] ">
          {service.description}
        </p>
        <div className="mt-5">
          <span className="text-3xl font-semibold">${service.price}</span>
          <span className="text-xs font-medium uppercase tracking-wider text-[#1A1B4B]/70 ">
            /month
          </span>
        </div>
        <ul className="mt-5 space-y-2.5">
          {service.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1A1B4B] " />
              <span className="text-sm leading-6 text-[#1A1B4B] ">
                {feature}
              </span>
            </li>
          ))}
        </ul>
        <Button
          onClick={onSubscribe}
          disabled={isSubscribing}
          className="mt-5 h-10 w-full rounded-none border border-[#1A1B4B]/20 bg-[#FFFFFF] px-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#1A1B4B] transition-colors hover:bg-[#1A1B4B]/10    "
        >
          {isSubscribing ? "Subscribing..." : "Get started"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.article>
  );
}

export function ServiceList({ userEmail }: { userEmail?: string | null }) {
  const [subscribing, setSubscribing] = useState<number | null>(null);

  const handleSubscribe = async (serviceId: number) => {
    if (!userEmail) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to subscribe to a service.",
        variant: "destructive",
      });
      return;
    }

    setSubscribing(serviceId);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubscribing(null);
    toast({
      title: "Subscribed!",
      description: "You have successfully subscribed to the service.",
    });
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => (
        <ServiceCard
          key={service.id}
          service={service}
          index={index}
          onSubscribe={() => handleSubscribe(service.id)}
          isSubscribing={subscribing === service.id}
        />
      ))}
    </div>
  );
}