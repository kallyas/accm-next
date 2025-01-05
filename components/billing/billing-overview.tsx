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

type Bill = {
  id: string;
  amount: number;
  date: Date;
  status: string;
};

export function BillingOverview({ bills }: { bills: Bill[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Overview</CardTitle>
        <CardDescription>Your recent bills and payment history</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>{bill.date.toLocaleDateString()}</TableCell>
                <TableCell>${bill.amount.toFixed(2)}</TableCell>
                <TableCell>{bill.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
