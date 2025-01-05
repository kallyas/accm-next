"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type Plan = {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
};

const availablePlans: Plan[] = [
  { id: "1", name: "Basic", price: 9.99, billingCycle: "Monthly" },
  { id: "2", name: "Pro", price: 19.99, billingCycle: "Monthly" },
  { id: "3", name: "Enterprise", price: 49.99, billingCycle: "Monthly" },
];

export function UpgradeOptions({ currentPlan }: { currentPlan: Plan | null }) {
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async (plan: Plan) => {
    setIsUpgrading(true);
    try {
      // Here you would typically make an API call to upgrade the plan
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API call
      toast({
        title: "Plan Upgraded",
        description: `You have successfully upgraded to the ${plan.name} plan.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upgrade plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const calculateDiscountedPrice = (price: number) => {
    return price * 0.95; // 5% discount
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrade Your Plan</CardTitle>
        <CardDescription>
          Choose a plan that suits your needs. Enjoy a 5% discount on any
          upgrade!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {availablePlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.billingCycle}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">
                  ${plan.price.toFixed(2)}/
                  {plan.billingCycle === "Monthly" ? "mo" : "yr"}
                </p>
                {currentPlan && plan.price > currentPlan.price && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Upgrade price: $
                    {calculateDiscountedPrice(plan.price).toFixed(2)}/
                    {plan.billingCycle === "Monthly" ? "mo" : "yr"}
                  </p>
                )}
                <Button
                  onClick={() => handleUpgrade(plan)}
                  disabled={
                    isUpgrading || (currentPlan && plan.id === currentPlan.id)
                  }
                >
                  {isUpgrading
                    ? "Upgrading..."
                    : currentPlan && plan.id === currentPlan.id
                    ? "Current Plan"
                    : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
