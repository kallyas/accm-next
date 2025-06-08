"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  VisibilityState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { User, Role, ProgressStatus } from "@prisma/client";
import {
  Edit,
  Trash2,
  Mail,
  Download,
  Filter,
  Settings,
  Users,
  Send,
  Eye,
  Search,
  MoreHorizontal,
  UserPlus,
  Calendar,
  Clock,
} from "lucide-react";

// Types
interface MarketingEmail {
  subject: string;
  content: string;
  recipientType: "all" | "role" | "selected";
  targetRole?: Role;
  selectedUsers?: string[];
  sendNow: boolean;
  scheduledDate?: string;
}

interface UserWithStatus extends User {
  lastLogin?: string;
  subscriptionStatus?: string;
  progressStatus: ProgressStatus;
}

// API functions
const api = {
  getUsers: async (): Promise<{ users: UserWithStatus[]; stats: any }> => {
    const response = await fetch("/api/admin/users");
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  deleteUser: async (userId: string) => {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete user");
    return response.json();
  },

  updateUser: async (userId: string, userData: Partial<User>) => {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Failed to update user");
    return response.json();
  },

  sendMarketingEmail: async (emailData: MarketingEmail) => {
    const response = await fetch("/api/admin/marketing/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailData),
    });
    if (!response.ok) throw new Error("Failed to send marketing email");
    return response.json();
  },

  exportUsers: async (format: "csv" | "xlsx") => {
    const response = await fetch(`/api/admin/users/export?format=${format}`);
    if (!response.ok) throw new Error("Failed to export users");
    return response.blob();
  },
};

// Marketing Email Dialog Component
function MarketingEmailDialog({
  selectedUsers,
  onClose,
}: {
  selectedUsers: UserWithStatus[];
  onClose: () => void;
}) {
  const [emailData, setEmailData] = useState<MarketingEmail>({
    subject: "",
    content: "",
    recipientType: selectedUsers.length > 0 ? "selected" : "all",
    selectedUsers: selectedUsers.map((u) => u.id),
    sendNow: true,
  });
  const [isOpen, setIsOpen] = useState(false);

  const sendEmailMutation = useMutation({
    mutationFn: api.sendMarketingEmail,
    onSuccess: (data) => {
      toast({
        title: "Email Sent Successfully",
        description: `Marketing email sent to ${data.sentTo} recipients.`,
      });
      setIsOpen(false);
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to Send Email",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    if (!emailData.subject || !emailData.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and content.",
        variant: "destructive",
      });
      return;
    }
    sendEmailMutation.mutate(emailData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Mail className="mr-2 h-4 w-4" />
          Send Marketing Email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Marketing Email</DialogTitle>
          <DialogDescription>
            Compose and send marketing emails to your users
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recipient Selection */}
          <div>
            <Label>Recipients</Label>
            <Select
              value={emailData.recipientType}
              onValueChange={(value: "all" | "role" | "selected") =>
                setEmailData({ ...emailData, recipientType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="role">By Role</SelectItem>
                <SelectItem value="selected">
                  Selected Users ({selectedUsers.length})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {emailData.recipientType === "role" && (
            <div>
              <Label>Target Role</Label>
              <Select
                value={emailData.targetRole}
                onValueChange={(value: Role) =>
                  setEmailData({ ...emailData, targetRole: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Users</SelectItem>
                  <SelectItem value="ADMIN">Admins</SelectItem>
                  <SelectItem value="MODERATOR">Moderators</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Subject */}
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={emailData.subject}
              onChange={(e) =>
                setEmailData({ ...emailData, subject: e.target.value })
              }
              placeholder="Enter email subject"
            />
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content">Email Content *</Label>
            <Textarea
              id="content"
              value={emailData.content}
              onChange={(e) =>
                setEmailData({ ...emailData, content: e.target.value })
              }
              placeholder="Enter your marketing message..."
              rows={8}
            />
          </div>

          {/* Send Options */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendNow"
                checked={emailData.sendNow}
                onCheckedChange={(checked) =>
                  setEmailData({ ...emailData, sendNow: checked as boolean })
                }
              />
              <Label htmlFor="sendNow">Send immediately</Label>
            </div>

            {!emailData.sendNow && (
              <div>
                <Label htmlFor="scheduledDate">Schedule for later</Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={emailData.scheduledDate}
                  onChange={(e) =>
                    setEmailData({
                      ...emailData,
                      scheduledDate: e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={sendEmailMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {sendEmailMutation.isPending ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : emailData.sendNow ? (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Now
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// User Edit Dialog Component
function UserEditDialog({
  user,
  isOpen,
  onClose,
  onSave,
}: {
  user: UserWithStatus | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, data: Partial<User>) => void;
}) {
  const [editData, setEditData] = useState<Partial<User>>({});

  useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

  const handleSave = () => {
    if (user && editData) {
      onSave(user.id, editData);
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and permissions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={editData.firstName || ""}
                onChange={(e) =>
                  setEditData({ ...editData, firstName: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={editData.lastName || ""}
                onChange={(e) =>
                  setEditData({ ...editData, lastName: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={editData.email || ""}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={editData.role}
              onValueChange={(value: Role) =>
                setEditData({ ...editData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MODERATOR">Moderator</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main Users Manager Component
export function UsersManager() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [editUser, setEditUser] = useState<UserWithStatus | null>(null);
  const [deleteUser, setDeleteUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const queryClient = useQueryClient();

  // Queries
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: api.getUsers,
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: api.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User has been deleted successfully.",
      });
      setDeleteUser(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
      setDeleteUser(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string;
      userData: Partial<User>;
    }) => api.updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  // Callbacks
  const handleEditUser = useCallback((user: UserWithStatus) => {
    setEditUser(user);
  }, []);

  const handleSaveUser = useCallback(
    (userId: string, userData: Partial<User>) => {
      updateMutation.mutate({ userId, userData });
    },
    [updateMutation]
  );

  const handleDeleteUser = useCallback(
    (userId: string) => {
      const user = data?.users.find((u: UserWithStatus) => u.id === userId);
      if (user) {
        setDeleteUser({
          id: userId,
          name: `${user.firstName} ${user.lastName}`,
        });
      }
    },
    [data?.users]
  );

  const handleConfirmDelete = useCallback(() => {
    if (deleteUser) {
      deleteMutation.mutate(deleteUser.id);
    }
  }, [deleteUser, deleteMutation]);

  const handleExport = useCallback(async (format: "csv" | "xlsx") => {
    try {
      const blob = await api.exportUsers(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `users.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export Successful",
        description: `Users exported as ${format.toUpperCase()} file.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export users.",
        variant: "destructive",
      });
    }
  }, []);

  // Memoized columns
  const columns = useMemo(
    (): ColumnDef<UserWithStatus>[] => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "firstName",
        header: "First Name",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("firstName")}</div>
        ),
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("lastName")}</div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="text-muted-foreground">{row.getValue("email")}</div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const role = row.getValue("role") as Role;
          const roleColors: { [key: string]: string } = {
            ADMIN: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
            MODERATOR:
              "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            USER: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            MENTOR:
              "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
          };
          return <Badge className={roleColors[role]}>{role}</Badge>;
        },
      },
      {
        accessorKey: "subscriptionStatus",
        header: "Subscription",
        cell: ({ row }) => {
          const status = row.getValue("subscriptionStatus") as string;
          if (!status)
            return <span className="text-muted-foreground">None</span>;

          const statusColors = {
            ACTIVE:
              "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            PENDING:
              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            CANCELLED:
              "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
          };
          return (
            <Badge
              className={
                statusColors[status as keyof typeof statusColors] || ""
              }
            >
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "lastLogin",
        header: "Last Login",
        cell: ({ row }) => {
          const lastLogin = row.getValue("lastLogin") as string;
          if (!lastLogin)
            return <span className="text-muted-foreground">Never</span>;
          return (
            <div className="text-sm">
              {new Date(lastLogin).toLocaleDateString()}
            </div>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const user = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(user.email);
                    toast({ title: "Email copied to clipboard" });
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Copy Email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleEditUser, handleDeleteUser]
  );

  // Memoized table instance
  const table = useReactTable({
    data: data?.users || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  // Get selected users - MOVED AFTER table initialization
  const selectedUsers = useMemo(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    return selectedRows.map((row) => row.original);
  }, [table, rowSelection]);

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">
          {error instanceof Error ? error.message : "Failed to load users"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      {data?.stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscribed</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.subscribed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New This Month
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.stats.newThisMonth}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(String(e.target.value))}
              className="pl-8 max-w-sm"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-2">
          {selectedUsers.length > 0 && (
            <MarketingEmailDialog
              selectedUsers={selectedUsers}
              onClose={() => setRowSelection({})}
            />
          )}
          <MarketingEmailDialog selectedUsers={[]} onClose={() => {}} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("xlsx")}>
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Selected Users Info */}
      {selectedUsers.length > 0 && (
        <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {selectedUsers.length} user(s) selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRowSelection({})}
              className="text-blue-800 dark:text-blue-200"
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteUser}
        onOpenChange={(open) => !open && setDeleteUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteUser?.name}? This action
              cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit User Dialog */}
      <UserEditDialog
        user={editUser}
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        onSave={handleSaveUser}
      />
    </div>
  );
}
