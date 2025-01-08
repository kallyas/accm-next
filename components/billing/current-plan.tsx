import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Plan = {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
};

export function CurrentPlan({ plan }: { plan: Plan | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Plan</CardTitle>
        <CardDescription>Your active subscription details</CardDescription>
      </CardHeader>
      <CardContent>
        {plan ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <Badge>{plan.billingCycle === "Monthly" ? "Monthly" : "Yearly"}</Badge>
            </div>
            <p className="text-2xl font-bold">
              ${plan.price.toFixed(2)}/
              {plan.billingCycle === "Monthly" ? "mo" : "yr"}
            </p>
          </div>
        ) : (
          <p>You don't have an active subscription.</p>
        )}
      </CardContent>
    </Card>
  );
}
