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
        return "bg-[#26A649]/10 text-[#26A649]";
      case "pending":
        return "bg-[#26A649]/10 text-[#26A649]";
      case "failed":
        return "bg-[#1A1B4B]/10 text-[#1A1B4B]";
      default:
        return "bg-[#1A1B4B]/10 text-[#1A1B4B]";
    }
  };

  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusStyles(status)}`}
    >
      {status}
    </span>
  );
}

export function BillingOverview({ bills }: { bills: Bill[] }) {
  return (
    <Card className="border border-[#1A1B4B]/20 bg-[#FFFFFF]">
      <CardHeader className="border-b border-[#1A1B4B]/10 pb-3">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-[#1A1B4B]/50" />
          <div>
            <CardTitle className="text-sm uppercase tracking-wider text-[#1A1B4B]">
              Billing History
            </CardTitle>
            <CardDescription className="text-xs text-[#1A1B4B]/60">
              Payment records
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {bills.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wider text-[#1A1B4B]/60 w-[120px]">Date</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#1A1B4B]/60">Amount</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-[#1A1B4B]/60">Status</TableHead>
                  <TableHead className="text-right text-xs uppercase tracking-wider text-[#1A1B4B]/60">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow key={bill.id} className="hover:bg-[#1A1B4B]/10">
                    <TableCell className="text-xs text-[#1A1B4B]">
                      {bill.date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-[#1A1B4B]">
                      ${bill.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={bill.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-xs uppercase tracking-wider">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <Receipt className="h-10 w-10 mx-auto mb-3 text-[#1A1B4B]/30" />
            <p className="text-xs text-[#1A1B4B]/60">No billing history</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}