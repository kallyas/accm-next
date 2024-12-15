"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type User = {
  id: string;
  name: string;
  email: string;
  plan: string;
};

export function UsersManager() {
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "John Doe", email: "john@example.com", plan: "Basic" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", plan: "Pro" },
  ]);

  const handleVerifySubscription = (userId: string) => {
    // In a real application, this would involve checking the user's subscription status
    // and potentially updating it in the database
    console.log(`Verifying subscription for user ${userId}`);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.plan}</TableCell>
              <TableCell>
                <Button onClick={() => handleVerifySubscription(user.id)}>
                  Verify Subscription
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
