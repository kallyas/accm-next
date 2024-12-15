"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  cv: z.instanceof(File).refine((file) => file.size <= 5000000, `Max file size is 5MB.`)
    .refine((file) => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type), "Only .pdf, .doc and .docx formats are supported.")
})

export function CVAlignmentForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isAligned, setIsAligned] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setFeedback(null)
    setIsAligned(false)

    // Simulating API call for CV comparison
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock feedback (in a real app, this would come from the backend)
    const mockFeedback = [
      "Your CV is missing a clear objective statement.",
      "Consider adding more quantifiable achievements in your work experience section.",
      "Your skills section could be more comprehensive. Consider adding relevant technical skills.",
      "The education section is well-structured, but you could add relevant coursework or projects.",
      "Consider adding a section for certifications or professional development."
    ]

    const alignmentScore = Math.random() // Random score between 0 and 1

    if (alignmentScore > 0.7) {
      setIsAligned(true)
      setFeedback("Congratulations! Your CV is well-aligned with our template. Keep up the good work!")
      // In a real app, you would update the user's track record here
      toast({
        title: "CV Aligned Successfully",
        description: "Your progress has been updated.",
      })
    } else {
      setFeedback(mockFeedback.join("\n"))
    }

    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Your CV</CardTitle>
        <CardDescription>
          We'll compare your CV against our system template and provide feedback.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="cv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CV File</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload your CV in PDF, DOC, or DOCX format. Maximum file size is 5MB.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Upload and Analyze"}
            </Button>
          </form>
        </Form>
      </CardContent>
      {feedback && (
        <CardFooter>
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-2">
              {isAligned ? "Alignment Successful" : "Areas for Improvement"}
            </h3>
            <p className="whitespace-pre-line">{feedback}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

