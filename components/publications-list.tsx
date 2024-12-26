import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Publication } from "@/types/publication";

type PublicationsListProps = {
  publications: Publication[];
};

export function PublicationsList({ publications }: PublicationsListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {publications.map((pub) => (
        <Card key={pub.id}>
          <CardHeader>
            <CardTitle>{pub.title}</CardTitle>
            <CardDescription>{pub.authors}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{pub.abstract}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {new Date(pub.publishedDate).toLocaleDateString()}
              </span>
              <Link
                href={pub.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                Read More
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
