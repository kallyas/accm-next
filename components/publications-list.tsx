import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Publication } from "@/types/publication";
import { Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

type PublicationsListProps = {
  publications: Publication[];
};

export function PublicationsList({ publications }: PublicationsListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {publications.map((pub) => (
        <Card key={pub.id} className="flex flex-col">
          <CardHeader>
            <div className="space-y-2">
              <CardTitle className="line-clamp-2">{pub.title}</CardTitle>
              <div className="flex flex-wrap gap-2">
                {pub.authors.split(", ").map((author) => (
                  <Badge key={author} variant="secondary">
                    {author}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-4 mb-4">
              {pub.abstract}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date(pub.publishedDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
              })}
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link
                href={pub.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Read Paper
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
