"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ChevronDown = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/200/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const ServiceCard = ({
  service,
  color = "blue",
}: {
  service: {
    icon?: React.ElementType;
    title: string;
    description: string;
    features: string[];
    image?: string;
    badge?: string;
    packages?: {
      name: string;
      duration: string;
      features: string[];
    }[];
  };
  color?: string;
}) => {
  const [showPackages, setShowPackages] = useState(false);

  return (
    <Card
      className={cn(
        "h-full border border-[#1A1B4B]/20 bg-[#FFFFFF] transition-colors hover:bg-[#1A1B4B]/10   "
      )}
    >
      {service.badge && (
        <Badge className="absolute top-3 right-3 z-10 bg-[#26A649]/10 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider hover:bg-[#26A649]/10">
          {service.badge}
        </Badge>
      )}

      <div className="relative aspect-[16/10] overflow-hidden">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[#1A1B4B]/5 ">
            <div className="flex h-full items-center justify-center">
              {service.icon && (
                <service.icon className="h-12 w-12 text-[#1A1B4B]/60 " />
              )}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1B4B]/50 via-[#1A1B4B]/10 to-transparent" />
        {service.icon && !service.image && (
          <div className="absolute bottom-4 left-4">
            <div className="flex h-10 w-10 items-center justify-center border border-[#1A1B4B]/20 bg-[#FFFFFF]  ">
              <service.icon className="h-5 w-5 text-[#1A1B4B] " />
            </div>
          </div>
        )}
      </div>

      <CardHeader className="p-5 pb-3">
        <h3 className="text-base font-semibold uppercase tracking-[0.03em]">
          {service.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#1A1B4B] ">
          {service.description}
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        <ul className="space-y-2.5">
          {service.features.slice(0, 4).map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1A1B4B] " />
              <span className="text-sm leading-6 text-[#1A1B4B] ">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {service.packages && (
          <div className="mt-5">
            <Button
              variant="ghost"
              onClick={() => setShowPackages(!showPackages)}
              className="h-9 w-full rounded-none border border-[#1A1B4B]/20 px-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#1A1B4B] hover:bg-[#1A1B4B]/10   "
            >
              {showPackages ? "Hide packages" : "View packages"}
              {showPackages ? (
                <ChevronDown className="ml-2 h-4 w-4" />
              ) : (
                <ChevronRight className="ml-2 h-4 w-4" />
              )}
            </Button>

            {showPackages && (
              <div className="mt-4 space-y-3">
                {service.packages.map((pkg, idx) => (
                  <div
                    key={idx}
                    className="border border-[#1A1B4B]/20 bg-[#FFFFFF] p-4  "
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold uppercase tracking-[0.03em] text-[#1A1B4B] ">
                        {pkg.name}
                      </h4>
                      <Badge
                        variant="outline"
                        className="border-[#1A1B4B]/20 text-[0.6rem] uppercase tracking-wider "
                      >
                        {pkg.duration}
                      </Badge>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {pkg.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#1A1B4B] " />
                          <span className="text-xs leading-5 text-[#1A1B4B] ">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-4">
        <Link
          href="#"
          className="flex h-10 w-full items-center justify-center border border-[#1A1B4B]/20 bg-[#FFFFFF] px-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#1A1B4B] transition-colors hover:bg-[#1A1B4B]/10    "
        >
          Learn more
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;