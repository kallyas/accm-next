import { ImageGallery } from "@/components/image-gallery"

export default function GalleryPage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Image Gallery</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Explore images from our events and success stories.
      </p>
      <ImageGallery />
    </div>
  )
}

