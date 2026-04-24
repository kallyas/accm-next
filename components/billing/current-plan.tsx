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
    <Card className="border border-[#1A1B4B]/20 bg-[#FFFFFF]">
      <CardHeader className="border-b border-[#1A1B4B]/10 pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-[#1A1B4B]/50" />
          <div>
            <CardTitle className="text-sm uppercase tracking-wider text-[#1A1B4B]">
              Current Plan
            </CardTitle>
            <CardDescription className="text-xs text-[#1A1B4B]/60">
              Your subscription
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {plan ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-[#1A1B4B]">
                {plan.name}
              </h3>
              <p className="text-2xl font-bold text-[#1A1B4B] mt-1">
                ${plan.price.toFixed(2)}
                <span className="text-xs font-normal text-[#1A1B4B]/60">
                  /{plan.billingCycle}
                </span>
              </p>
            </div>
            <Button className="w-full bg-[#1A1B4B] text-[#FFFFFF] text-xs uppercase tracking-wider">
              Manage Plan
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-sm text-[#1A1B4B]/60">
                No active subscription
              </p>
            </div>
            <Button asChild className="w-full bg-[#1A1B4B] text-[#FFFFFF] text-xs uppercase tracking-wider">
              <a href="/dashboard/billing">Subscribe Now</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}