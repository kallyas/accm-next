"use client";

import { usePublications } from "@/hooks/use-publications";
import { PublicationsList } from "@/components/publications-list";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function PublicationsPage() {
  const { data: publications, isLoading, error } = usePublications();

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Our Publications</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Explore our latest research and insights on career development and
        mentorship.
      </p>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load publications. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {publications && <PublicationsList publications={publications} />}
    </div>
  );
}
