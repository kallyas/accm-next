import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { UserEvent } from "@/types/feedback";

export const columns: ColumnDef<UserEvent>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "eventName",
    header: "Event",
  },
  {
    accessorKey: "eventDate",
    header: "Event Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("eventDate"));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "registeredAt",
    header: "Registration Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("registeredAt"));
      return date.toLocaleDateString();
    },
  },
];
