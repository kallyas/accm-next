"use client";

import { Suspense } from "react";
import { ImageGallery } from "@/components/image-gallery";
import { ImageCarousel } from "@/components/image-carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { allImages } from "@/data";
import { useGalleryStore } from "@/stores/gallery-store";
import ViewToggle from "@/components/view-toggle";

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array(12)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="aspect-[3/4] overflow-hidden border border-gray-300 dark:border-gray-800">
            <Skeleton className="h-full w-full rounded-none" />
          </div>
        ))}
    </div>
  );
}

export default function GalleryPage() {
  const featuredImages = allImages.filter((img) => img.featured).slice(0, 5);
  const { setSelectedImage } = useGalleryStore();

  return (
    <div className="bg-[#f7f5f1] text-gray-900 dark:bg-[#111416] dark:text-gray-100">
      <main className="mx-auto w-full max-w-[88rem] px-5 py-10 sm:px-7 lg:px-10">
        <section className="border border-gray-300 dark:border-gray-800">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="bg-[#ece8df] p-7 dark:bg-[#171b1d] sm:p-10">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                Gallery
              </p>
              <h1 className="mt-4 text-balance text-[clamp(1.9rem,4.2vw,3.8rem)] font-semibold uppercase leading-[0.98]">
                Moments from ACCM programs, events, and community.
              </h1>
              <p className="mt-5 max-w-[58ch] text-sm leading-8 text-gray-700 dark:text-gray-300">
                Explore featured stories and browse the full archive by category
                using gallery and carousel views.
              </p>
            </div>
            <div className="flex items-center bg-[#171b1d] px-7 py-10 text-gray-100 sm:px-10">
              <p className="text-sm leading-8 text-gray-300">
                Select a photo in the carousel or switch view mode for faster
                scanning.
              </p>
            </div>
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-16">
          <div className="mb-8">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
              Featured moments
            </p>
            <div className="mt-4 border border-gray-300 bg-white/70 p-4 dark:border-gray-800 dark:bg-[#171b1d]">
              <ImageCarousel
                images={featuredImages}
                onSelect={(image) => setSelectedImage(image)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <TabsList className="grid h-auto w-full max-w-2xl grid-cols-5 rounded-none border border-gray-300 bg-white/60 p-1 dark:border-gray-800 dark:bg-[#171b1d]">
                <TabsTrigger
                  value="all"
                  className="rounded-none border border-transparent py-2.5 data-[state=active]:border-gray-300 data-[state=active]:bg-[#ece8df] dark:data-[state=active]:border-gray-700 dark:data-[state=active]:bg-[#111416]"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="rounded-none border border-transparent py-2.5 data-[state=active]:border-gray-300 data-[state=active]:bg-[#ece8df] dark:data-[state=active]:border-gray-700 dark:data-[state=active]:bg-[#111416]"
                >
                  Events
                </TabsTrigger>
                <TabsTrigger
                  value="success"
                  className="rounded-none border border-transparent py-2.5 data-[state=active]:border-gray-300 data-[state=active]:bg-[#ece8df] dark:data-[state=active]:border-gray-700 dark:data-[state=active]:bg-[#111416]"
                >
                  Success
                </TabsTrigger>
                <TabsTrigger
                  value="others"
                  className="rounded-none border border-transparent py-2.5 data-[state=active]:border-gray-300 data-[state=active]:bg-[#ece8df] dark:data-[state=active]:border-gray-700 dark:data-[state=active]:bg-[#111416]"
                >
                  Others
                </TabsTrigger>
                <TabsTrigger
                  value="featured"
                  className="rounded-none border border-transparent py-2.5 data-[state=active]:border-gray-300 data-[state=active]:bg-[#ece8df] dark:data-[state=active]:border-gray-700 dark:data-[state=active]:bg-[#111416]"
                >
                  Featured
                </TabsTrigger>
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
            <TabsContent value="others" className="m-0">
              <Suspense fallback={<GallerySkeleton />}>
                <ImageGallery filter="others" />
              </Suspense>
            </TabsContent>
            <TabsContent value="featured" className="m-0">
              <Suspense fallback={<GallerySkeleton />}>
                <ImageGallery filter="featured" />
              </Suspense>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
