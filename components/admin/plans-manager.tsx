"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Plan = {
  id: string
  name: string
  price: number
  features: string[]
}

export function PlansManager() {
  const [plans, setPlans] = useState<Plan[]>([
    { id: "1", name: "Basic", price: 9.99, features: ["1 mentorship session/month", "Access to resources"] },
    { id: "2", name: "Pro", price: 19.99, features: ["2 mentorship sessions/month", "Access to all resources", "Priority support"] },
  ])

  const [newPlan, setNewPlan] = useState<Omit<Plan, "id">>({
    name: "",
    price: 0,
    features: [],
  })

  const handleAddPlan = () => {
    const plan = { ...newPlan, id: Date.now().toString() }
    setPlans([...plans, plan])
    setNewPlan({ name: "", price: 0, features: [] })
  }

  const handleDeletePlan = (id: string) => {
    setPlans(plans.filter((plan) => plan.id !== id))
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New Plan</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Plan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Plan Name"
              value={newPlan.name}
              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Price"
              value={newPlan.price}
              onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) })}
            />
            <Input
              placeholder="Features (comma-separated)"
              value={newPlan.features.join(", ")}
              onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value.split(", ") })}
            />
            <Button onClick={handleAddPlan}>Add Plan</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Features</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell>{plan.name}</TableCell>
              <TableCell>${plan.price.toFixed(2)}</TableCell>
              <TableCell>{plan.features.join(", ")}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleDeletePlan(plan.id)}>
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

