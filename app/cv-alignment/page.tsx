import { CVAlignmentForm } from "@/components/cv-alignment-form"

export default function CVAlignmentPage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">CV Alignment Service</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Upload your CV to compare it against our system-provided template and receive personalized feedback.
      </p>
      <CVAlignmentForm />
    </div>
  )
}

