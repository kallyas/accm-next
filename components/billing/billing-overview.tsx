import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";

type Bill = {
  id: string;
  amount: number;
  date: Date;
  status: string;
};

function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusStyles(
        status
      )}`}
    >
      {status}
    </span>
  );
}

export function BillingOverview({ bills }: { bills: Bill[] }) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <Receipt className="w-5 h-5 text-gray-500" />
          <div>
            <CardTitle>Billing Overview</CardTitle>
            <CardDescription>Track your payment history</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {bills.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[150px]">Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow
                    key={bill.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="font-medium">
                      {bill.date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>${bill.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <StatusBadge status={bill.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No billing history available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
