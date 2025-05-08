"use client";

import { Suspense } from "react";
import { ImageGallery } from "@/components/image-gallery";
import { ImageCarousel } from "@/components/image-carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { allImages } from "@/data";
import { useGalleryStore } from "@/stores/gallery-store";
import ViewToggle from "@/components/view-toggle";

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array(12)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-xl overflow-hidden">
            <Skeleton className="h-full w-full" />
          </div>
        ))}
    </div>
  );
}

export default function GalleryPage() {
  // Get featured images for the carousel
  const featuredImages = allImages.filter((img) => img.featured).slice(0, 5);
  const { setSelectedImage } = useGalleryStore();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-background/80">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight">
            Immersive Gallery
          </h1>
          <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto italic">
            Discover captivating moments from our journey
          </p>
        </header>

        {/* Featured Images Carousel */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Featured Moments</h2>
          <ImageCarousel
            images={featuredImages}
            onSelect={(image) => setSelectedImage(image)}
          />
        </div>

        <Card className="backdrop-blur-md bg-background/60 border border-white/10 shadow-xl mb-10">
          <CardContent className="p-6">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-4 bg-background/50">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="success">Success</TabsTrigger>
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                </TabsList>

                <ViewToggle />
              </div>

              <TabsContent value="all" className="m-0">
                <Suspense fallback={<GallerySkeleton />}>
                  <ImageGallery filter="all" />
                </Suspense>
              </TabsContent>
              <TabsContent value="events" className="m-0">
                <Suspense fallback={<GallerySkeleton />}>
                  <ImageGallery filter="events" />
                </Suspense>
              </TabsContent>
              <TabsContent value="success" className="m-0">
                <Suspense fallback={<GallerySkeleton />}>
                  <ImageGallery filter="success" />
                </Suspense>
              </TabsContent>
              <TabsContent value="featured" className="m-0">
                <Suspense fallback={<GallerySkeleton />}>
                  <ImageGallery filter="featured" />
                </Suspense>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
