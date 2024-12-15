import { PublicationsList } from "@/components/publications-list"
import { Button } from "@/components/ui/button"

export default function PublicationsPage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Our Publications</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Explore our latest research and insights on career development and mentorship.
      </p>
      <PublicationsList />
      <div className="mt-8">
        <Button>Submit a Publication</Button>
      </div>
    </div>
  )
}

