import { BlogList } from "@/components/blog-list"

export default function BlogsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">Our Blog</h1>
      <BlogList />
    </div>
  )
}

