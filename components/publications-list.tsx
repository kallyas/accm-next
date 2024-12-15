import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const publications = [
  {
    id: 1,
    title: "The Impact of Mentorship on Career Progression in Africa",
    authors: "Abel Wilson Walekhwa, et al.",
    date: "2023-05-15",
    abstract: "This study examines the effects of structured mentorship programs on career advancement among young professionals in various African countries.",
    link: "#"
  },
  {
    id: 2,
    title: "Bridging the Skills Gap: A Case Study of the 4WFramework",
    authors: "Jane Doe, John Smith",
    date: "2023-07-22",
    abstract: "An analysis of the effectiveness of the 4WFramework in identifying and addressing skills gaps in the African job market.",
    link: "#"
  },
  {
    id: 3,
    title: "The Role of Technology in Scaling Mentorship Programs",
    authors: "Alice Johnson, Bob Brown",
    date: "2023-09-10",
    abstract: "This paper explores how digital platforms can be leveraged to expand the reach and impact of mentorship initiatives across Africa.",
    link: "#"
  }
]

export function PublicationsList() {
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
              <span className="text-sm text-muted-foreground">{pub.date}</span>
              <Link href={pub.link} className="text-sm font-medium text-primary hover:underline">
                Read More
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

