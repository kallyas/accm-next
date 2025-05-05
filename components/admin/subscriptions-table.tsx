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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
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
  ArrowUpDown,
  Mail,
  Loader2,
  Download,
  Info,
  MessageSquare,
  Edit,
  AlertTriangle,
  SearchIcon,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Subscription {
  id: string;
  userId: string;
  planId?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "ACTIVE";
  createdAt: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  plan?: {
    id: string;
    name: string;
    price: number;
    currency: string;
    duration: string;
    description: string;
  };
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

// Fetch subscriptions from the backend
async function fetchSubscriptions(): Promise<Subscription[]> {
  const response = await fetch("/api/admin/subscriptions");
  if (!response.ok) throw new Error("Failed to fetch subscriptions");
  return response.json();
}

// Update subscription status
async function updateSubscriptionStatus(
  id: string,
  status: "APPROVED" | "REJECTED" | "CANCELLED" | "ACTIVE" | "PENDING",
  notes?: string
) {
  const response = await fetch("/api/admin/subscriptions", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status, notes }),
  });
  if (!response.ok) throw new Error("Failed to update subscription status");
  return response.json();
}

function LoadingRow() {
  return (
    <TableRow>
      <TableCell>
        <Checkbox disabled />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-8 rounded-full" />
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
    EXPIRED: {
      variant: "destructive" as const,
      icon: Ban,
      label: "Expired",
    }
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <config.icon className="h-3 w-3" />
      <span>{config.label}</span>
    </Badge>
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
        <DialogFooter className="gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button>
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  actionLabel: string;
  variant?: "default" | "destructive";
  isLoading?: boolean;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              actionLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SubscriptionDetailsSheet({
  subscription,
  onClose,
  onStatusChange,
}: {
  subscription: Subscription | null;
  onClose: () => void;
  onStatusChange: (id: string, status: Subscription["status"], notes?: string) => void;
}) {
  const [notes, setNotes] = useState(subscription?.notes || "");
  const [isLoading, setIsLoading] = useState(false);

  if (!subscription) return null;
  
  const handleStatusChange = async (status: Subscription["status"]) => {
    setIsLoading(true);
    try {
      await onStatusChange(subscription.id, status, notes);
      toast({
        title: "Success",
        description: `Subscription status updated to ${status.toLowerCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription status.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={!!subscription} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Subscription Details</SheetTitle>
          <SheetDescription>
            View and manage subscription information
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-200px)] pr-4 mt-6">
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback>
                  {subscription.user.firstName[0]}
                  {subscription.user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-lg">
                  {subscription.user.firstName} {subscription.user.lastName}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-1 h-3 w-3" />
                  <span>{subscription.user.email}</span>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div>
              <Label>Current Status</Label>
              <div className="mt-2">
                <StatusBadge status={subscription.status} />
              </div>
            </div>

            {/* Subscription Details */}
            <Card>
              <CardContent className="p-4 space-y-4">
                {subscription.plan && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Plan Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Plan</div>
                      <div className="font-medium">{subscription.plan.name}</div>
                      <div className="text-muted-foreground">Amount</div>
                      <div className="font-medium">
                        {subscription.plan.price
                          ? `${subscription.plan.currency}${subscription.plan.price}`
                          : "N/A"}
                      </div>
                      <div className="text-muted-foreground">Duration</div>
                      <div className="font-medium">{subscription.plan.duration}</div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-2">Dates</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Created</div>
                    <div className="font-medium">
                      {new Date(subscription.createdAt).toLocaleDateString()}
                    </div>
                    {subscription.startDate && (
                      <>
                        <div className="text-muted-foreground">Start Date</div>
                        <div className="font-medium">
                          {new Date(subscription.startDate).toLocaleDateString()}
                        </div>
                      </>
                    )}
                    {subscription.endDate && (
                      <>
                        <div className="text-muted-foreground">End Date</div>
                        <div className="font-medium">
                          {new Date(subscription.endDate).toLocaleDateString()}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Receipt */}
            {subscription.paymentProofs && subscription.paymentProofs.length > 0 && (
              <div>
                <Label className="mb-2 block">Payment Receipt</Label>
                <div className="border rounded-md overflow-hidden">
                  <Image
                    src={subscription.paymentProofs[0]?.imageUrl || ""}
                    alt="Receipt"
                    width={400}
                    height={600}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-3 w-3" />
                    Download
                  </Button>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add notes about this subscription..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            {subscription.status === "PENDING" && (
              <div className="flex gap-2">
                <Button 
                  variant="default" 
                  className="flex-1"
                  onClick={() => handleStatusChange("APPROVED")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Approve
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={() => handleStatusChange("REJECTED")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                  )}
                  Reject
                </Button>
              </div>
            )}
            
            {subscription.status === "APPROVED" && (
              <div className="flex gap-2">
                <Button 
                  variant="default" 
                  className="flex-1"
                  onClick={() => handleStatusChange("ACTIVE")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Activate
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={() => handleStatusChange("CANCELLED")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Ban className="mr-2 h-4 w-4" />
                  )}
                  Cancel
                </Button>
              </div>
            )}
            
            {(subscription.status === "ACTIVE") && (
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => handleStatusChange("CANCELLED")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Ban className="mr-2 h-4 w-4" />
                )}
                Cancel Subscription
              </Button>
            )}
          </div>
        </ScrollArea>
        <SheetFooter className="mt-4">
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
          <Button onClick={() => onClose()}>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function SubscriptionsTable() {
  const queryClient = useQueryClient();
  const [selectedSubscription, setSelectedSubscription] = useState<{
    id: string;
    action: "approve" | "reject" | "cancel" | "activate";
  } | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<Subscription | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch subscriptions from the backend
  const {
    data: subscriptions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
  });

  // Update subscription status mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: "APPROVED" | "REJECTED" | "CANCELLED" | "ACTIVE" | "PENDING";
      notes?: string;
    }) => updateSubscriptionStatus(id, status, notes),
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

  // Filter subscriptions based on search query and status filter
  const filteredSubscriptions = subscriptions?.filter(subscription => {
    // Filter by status if a status filter is applied
    if (filteredStatus && subscription.status !== filteredStatus) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${subscription.user.firstName} ${subscription.user.lastName}`.toLowerCase();
      const email = subscription.user.email.toLowerCase();
      const planName = subscription.plan?.name?.toLowerCase() || "";
      
      return fullName.includes(query) || 
             email.includes(query) || 
             planName.includes(query);
    }
    
    return true;
  });

  const handleAction = (action: "approve" | "reject" | "cancel" | "activate") => {
    if (!selectedSubscription) return;

    const statusMap = {
      approve: "APPROVED",
      reject: "REJECTED",
      cancel: "CANCELLED",
      activate: "ACTIVE",
    } as const;

    updateMutation.mutate({
      id: selectedSubscription.id,
      status: statusMap[action],
    });
  };
  
  const handleBulkAction = (action: "approve" | "reject" | "cancel" | "activate") => {
    if (selectedRows.length === 0) return;
    
    // Confirmation for bulk actions
    if (confirm(`Are you sure you want to ${action} ${selectedRows.length} subscriptions?`)) {
      const statusMap = {
        approve: "APPROVED",
        reject: "REJECTED",
        cancel: "CANCELLED",
        activate: "ACTIVE",
      } as const;
      
      // Process all selected subscriptions
      const promises = selectedRows.map(id => 
        updateMutation.mutateAsync({
          id,
          status: statusMap[action],
        })
      );
      
      Promise.all(promises)
        .then(() => {
          toast({
            title: "Bulk Action Completed",
            description: `Successfully processed ${selectedRows.length} subscriptions.`,
          });
          setSelectedRows([]);
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Some subscriptions could not be processed.",
            variant: "destructive",
          });
        });
    }
  };
  
  const handleStatusChange = (id: string, status: Subscription["status"], notes?: string) => {
    return updateMutation.mutateAsync({
      id,
      status,
      notes,
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredSubscriptions?.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredSubscriptions?.map(sub => sub.id) || []);
    }
  };
  
  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

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
    activate: {
      title: "Activate Subscription",
      description: "Are you sure you want to activate this subscription?",
      actionLabel: "Activate",
      variant: "default" as const,
    },
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

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email or plan..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select 
          value={filteredStatus || "all"} 
          onValueChange={(value) => setFilteredStatus(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="EXPIRED">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div className="bg-muted/50 p-2 rounded-md flex items-center justify-between mb-4">
          <div className="text-sm">
            <span className="font-medium">{selectedRows.length}</span> items selected
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleBulkAction("approve")}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleBulkAction("reject")}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setSelectedRows([])}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {/* Subscriptions Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox 
                  checked={selectedRows.length > 0 && selectedRows.length === filteredSubscriptions?.length}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  User
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <div className="flex items-center">
                  Plan
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Amount
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Created
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Receipt</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => <LoadingRow key={i} />)}

            {filteredSubscriptions?.map((subscription) => (
              <TableRow 
                key={subscription.id}
                className={
                  selectedRows.includes(subscription.id) 
                    ? "bg-muted/40" 
                    : ""
                }
              >
                <TableCell>
                  <Checkbox 
                    checked={selectedRows.includes(subscription.id)}
                    onCheckedChange={() => toggleSelectRow(subscription.id)}
                    aria-label={`Select row ${subscription.id}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {subscription.user.firstName[0]}
                        {subscription.user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {subscription.user.firstName} {subscription.user.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {subscription.user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={subscription.status} />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{subscription.plan?.name || "N/A"}</div>
                  <div className="text-xs text-muted-foreground">
                    {subscription.plan?.duration || "N/A"}
                  </div>
                </TableCell>
                <TableCell>
                  {subscription.plan?.price 
                    ? `${subscription.plan.currency || "$"}${subscription.plan.price}` 
                    : "N/A"
                  }
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {new Date(subscription.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(subscription.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  {subscription.paymentProofs && subscription.paymentProofs.length > 0 ? (
                    <ReceiptDialog
                      imageUrl={subscription.paymentProofs[0].imageUrl}
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">No receipt</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSubscriptionDetails(subscription)}>
                          <Info className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Contact User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                          Edit Notes
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
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
                        {subscription.status === "APPROVED" && (
                          <DropdownMenuItem
                            onClick={() =>
                              setSelectedSubscription({
                                id: subscription.id,
                                action: "activate",
                              })
                            }
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
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
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {!isLoading && filteredSubscriptions?.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
                    <div className="text-lg font-medium">No subscriptions found</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {searchQuery || filteredStatus 
                        ? "Try adjusting your filters or search criteria" 
                        : "No subscriptions available in the system"}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {filteredSubscriptions && filteredSubscriptions.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{filteredSubscriptions.length}</span> of{" "}
            <span className="font-medium">{filteredSubscriptions.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {selectedSubscription && (
        <ConfirmActionDialog
          isOpen={!!selectedSubscription}
          onClose={() => setSelectedSubscription(null)}
          onConfirm={() => handleAction(selectedSubscription.action)}
          isLoading={updateMutation.isPending}
          {...confirmDialogConfig[selectedSubscription.action]}
        />
      )}
      
      {/* Subscription Details Sheet */}
      <SubscriptionDetailsSheet 
        subscription={subscriptionDetails}
        onClose={() => setSubscriptionDetails(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}