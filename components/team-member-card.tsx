"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Twitter, Mail } from "lucide-react";
import { TeamMember } from "@/types/general";

export function TeamMemberCard({ member }: { member: TeamMember }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="flex flex-col h-full group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="relative p-0 mb-4">
        <div className="relative w-full pt-[100%] overflow-hidden">
          <Image
            src={member.imageUrl}
            alt={member.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle className="mb-2">{member.name}</CardTitle>
        <p className="text-sm font-medium text-primary mb-2">
          {member.position}
        </p>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {member.about}
        </p>
        <div className="flex flex-wrap gap-2">
          {member.expertise.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="flex gap-2">
          {member.socialLinks?.linkedin && (
            <Button variant="ghost" size="icon" asChild>
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          )}
          {member.socialLinks?.twitter && (
            <Button variant="ghost" size="icon" asChild>
              <a
                href={member.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
          )}
          {member.socialLinks?.email && (
            <Button variant="ghost" size="icon" asChild>
              <a href={`mailto:${member.socialLinks.email}`}>
                <Mail className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>View Profile</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-start gap-6">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div>
                  <DialogTitle className="text-2xl mb-2">
                    {member.name}
                  </DialogTitle>
                  <DialogDescription>
                    <p className="text-primary font-medium">
                      {member.position}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.department}
                    </p>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="mt-6 space-y-4">
              <h4 className="font-medium">About</h4>
              <p className="text-muted-foreground">{member.about}</p>
              <h4 className="font-medium">Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {member.expertise.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
