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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle,
  Ban,
  MoreVertical,
  Timer,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

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

function LoadingRow() {
  return (
    <TableRow>
      <TableCell>
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-8" />
      </TableCell>
    </TableRow>
  );
}

function StatusBadge({ status }: { status: Subscription["status"] }) {
  const statusConfig = {
    APPROVED: {
      variant: "secondary" as const,
      icon: CheckCircle,
      label: "Approved",
    },
    REJECTED: {
      variant: "destructive" as const,
      icon: XCircle,
      label: "Rejected",
    },
    PENDING: {
      variant: "outline" as const,
      icon: Timer,
      label: "Pending",
    },
    ACTIVE: {
      variant: "default" as const,
      icon: CheckCircle,
      label: "Active",
    },
    CANCELLED: {
      variant: "destructive" as const,
      icon: Ban,
      label: "Cancelled",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <config.icon className="h-3 w-3" />
      <span>{config.label}</span>
    </Badge>
  );
}

function ConfirmActionDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionLabel,
  variant = "default",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  actionLabel: string;
  variant?: "default" | "destructive";
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={variant} onClick={onConfirm}>
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReceiptDialog({ imageUrl }: { imageUrl: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          View Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Payment Receipt</DialogTitle>
          <DialogDescription>
            Review the payment details below
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 rounded-lg overflow-hidden border">
          <Image
            src={imageUrl}
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
  const [selectedSubscription, setSelectedSubscription] = useState<{
    id: string;
    action: "approve" | "reject" | "cancel";
  } | null>(null);

  const {
    data: subscriptions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
  });

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
        title: "Success",
        description: "Subscription status has been updated.",
      });
      setSelectedSubscription(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update subscription status.",
        variant: "destructive",
      });
    },
  });

  const handleAction = (action: "approve" | "reject" | "cancel") => {
    if (!selectedSubscription) return;

    const statusMap = {
      approve: "APPROVED",
      reject: "REJECTED",
      cancel: "CANCELLED",
    } as const;

    updateMutation.mutate({
      id: selectedSubscription.id,
      status: statusMap[action],
    });
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load subscriptions. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  const confirmDialogConfig = {
    approve: {
      title: "Approve Subscription",
      description: "Are you sure you want to approve this subscription?",
      actionLabel: "Approve",
      variant: "default" as const,
    },
    reject: {
      title: "Reject Subscription",
      description: "Are you sure you want to reject this subscription?",
      actionLabel: "Reject",
      variant: "destructive" as const,
    },
    cancel: {
      title: "Cancel Subscription",
      description: "Are you sure you want to cancel this subscription?",
      actionLabel: "Cancel",
      variant: "destructive" as const,
    },
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Receipt</TableHead>
              <TableHead className="w-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => <LoadingRow key={i} />)}

            {subscriptions?.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>
                  <div className="font-medium">
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
                    imageUrl={subscription.paymentProofs[0].imageUrl}
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {subscription.status === "PENDING" && (
                        <>
                          <DropdownMenuItem
                            onClick={() =>
                              setSelectedSubscription({
                                id: subscription.id,
                                action: "approve",
                              })
                            }
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setSelectedSubscription({
                                id: subscription.id,
                                action: "reject",
                              })
                            }
                            className="text-destructive"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      {(subscription.status === "APPROVED" ||
                        subscription.status === "ACTIVE") && (
                        <DropdownMenuItem
                          onClick={() =>
                            setSelectedSubscription({
                              id: subscription.id,
                              action: "cancel",
                            })
                          }
                          className="text-destructive"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Cancel
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {subscriptions?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="text-muted-foreground">
                    No subscriptions found
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedSubscription && (
        <ConfirmActionDialog
          isOpen={!!selectedSubscription}
          onClose={() => setSelectedSubscription(null)}
          onConfirm={() => handleAction(selectedSubscription.action)}
          {...confirmDialogConfig[selectedSubscription.action]}
        />
      )}
    </div>
  );
}
