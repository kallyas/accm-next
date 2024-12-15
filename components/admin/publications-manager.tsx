"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Publication = {
  id: string
  title: string
  author: string
  date: string
}

export function PublicationsManager() {
  const [publications, setPublications] = useState<Publication[]>([
    { id: "1", title: "Career Development in the Digital Age", author: "Dr. Abel Wilson", date: "2023-05-15" },
    { id: "2", title: "The Impact of Mentorship on Professional Growth", author: "Sarah Mutesi", date: "2023-06-22" },
  ])

  const [newPublication, setNewPublication] = useState<Omit<Publication, "id">>({
    title: "",
    author: "",
    date: "",
  })

  const handleAddPublication = () => {
    const publication = { ...newPublication, id: Date.now().toString() }
    setPublications([...publications, publication])
    setNewPublication({ title: "", author: "", date: "" })
  }

  const handleDeletePublication = (id: string) => {
    setPublications(publications.filter((publication) => publication.id !== id))
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New Publication</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Publication</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Publication Title"
              value={newPublication.title}
              onChange={(e) => setNewPublication({ ...newPublication, title: e.target.value })}
            />
            <Input
              placeholder="Author"
              value={newPublication.author}
              onChange={(e) => setNewPublication({ ...newPublication, author: e.target.value })}
            />
            <Input
              type="date"
              value={newPublication.date}
              onChange={(e) => setNewPublication({ ...newPublication, date: e.target.value })}
            />
            <Button onClick={handleAddPublication}>Add Publication</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {publications.map((publication) => (
            <TableRow key={publication.id}>
              <TableCell>{publication.title}</TableCell>
              <TableCell>{publication.author}</TableCell>
              <TableCell>{publication.date}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleDeletePublication(publication.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

