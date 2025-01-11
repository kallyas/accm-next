import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CreditCard } from "lucide-react";

type Plan = {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
};

export function CurrentPlan({ plan }: { plan: Plan | null }) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-gray-500" />
          <div>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Manage your subscription</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {plan ? (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {plan.name}
                </h3>
                <p className="text-3xl font-bold mt-2">
                  ${plan.price.toFixed(2)}
                  <span className="text-base font-normal text-gray-500">
                    /{plan.billingCycle === "Monthly" ? "mo" : "yr"}
                  </span>
                </p>
              </div>
              <Badge variant="outline" className="border-2">
                {plan.billingCycle}
              </Badge>
            </div>
            <div className="pt-4 border-t dark:border-gray-800">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-2" />
                Next billing date: {new Date().toLocaleDateString()}
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Manage Subscription
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No active subscription</p>
            <Button className="mt-4">Choose a Plan</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
