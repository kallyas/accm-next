"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { CheckCircle, XCircle, Eye, AlertCircle, Ban } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface Subscription {
  id: string;
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "ACTIVE";
  receiptUrl: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  paymentProofs: {
    id: string;
    imageUrl: string;
  }[];
}

// API functions
async function fetchSubscriptions(): Promise<Subscription[]> {
  const response = await fetch("/api/admin/subscriptions");
  if (!response.ok) throw new Error("Failed to fetch subscriptions");
  return response.json();
}

async function updateSubscriptionStatus(
  id: string,
  status: "APPROVED" | "REJECTED" | "CANCELLED"
) {
  const response = await fetch("/api/admin/subscriptions", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  if (!response.ok) throw new Error("Failed to update subscription status");
  return response.json();
}

// Loading row component
function LoadingRow() {
  return (
    <TableRow>
      <TableCell>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-3 w-[150px]" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-[80px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-9 w-[100px]" />
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Skeleton className="h-9 w-[80px]" />
          <Skeleton className="h-9 w-[80px]" />
        </div>
      </TableCell>
    </TableRow>
  );
}

// Status badge component
function StatusBadge({ status }: { status: Subscription["status"] }) {
  const variants = {
    APPROVED: { variant: "secondary", icon: CheckCircle },
    REJECTED: { variant: "destructive", icon: XCircle },
    PENDING: { variant: "outline", icon: AlertCircle },
    ACTIVE: { variant: "default", icon: CheckCircle },
    CANCELLED: { variant: "destructive", icon: Ban },
  } as const;

  const { variant, icon: Icon } = variants[status];

  return (
    <Badge variant={variant} className="flex items-center gap-1 p-2">
      <Icon className="h-3 w-3" />
      <span>{status}</span>
    </Badge>
  );
}

// Receipt dialog component
function ReceiptDialog({ receiptUrl }: { receiptUrl: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          View Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payment Receipt</DialogTitle>
          <DialogDescription>
            Verify the payment details in the receipt
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 rounded-lg overflow-hidden border">
          <Image
            src={receiptUrl}
            alt="Receipt"
            width={800}
            height={1000}
            className="w-full h-auto object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SubscriptionsTable() {
  const queryClient = useQueryClient();

  // Fetch subscriptions
  const {
    data: subscriptions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  // Update subscription status
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "APPROVED" | "REJECTED" | "CANCELLED";
    }) => updateSubscriptionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast({
        title: "Status Updated",
        description: "The subscription status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update subscription status. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load subscriptions. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Receipt</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => <LoadingRow key={i} />)}

          {subscriptions?.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell className="font-medium">
                <div>
                  {subscription.user.firstName} {subscription.user.lastName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {subscription.user.email}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={subscription.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(subscription.createdAt).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}
              </TableCell>
              <TableCell>
                <ReceiptDialog
                  receiptUrl={subscription.paymentProofs[0].imageUrl}
                />
              </TableCell>
              <TableCell className="text-right">
                {subscription.status === "PENDING" && (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        updateMutation.mutate({
                          id: subscription.id,
                          status: "APPROVED",
                        })
                      }
                      disabled={updateMutation.isPending}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        updateMutation.mutate({
                          id: subscription.id,
                          status: "REJECTED",
                        })
                      }
                      disabled={updateMutation.isPending}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}
                {(subscription.status === "APPROVED" ||
                  subscription.status === "ACTIVE") && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      updateMutation.mutate({
                        id: subscription.id,
                        status: "CANCELLED",
                      })
                    }
                    disabled={updateMutation.isPending}
                  >
                    <Ban className="mr-1 h-4 w-4" />
                    Cancel Subscription
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}

          {subscriptions?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <div className="text-muted-foreground">
                  No subscriptions found
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
