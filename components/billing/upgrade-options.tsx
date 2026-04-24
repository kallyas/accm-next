"use client";

import { ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SubscribePlan } from "../user/subscribe-plan";

export function UpgradeOptions() {
  return (
    <Card className="border border-[#1A1B4B]/20 bg-[#FFFFFF]">
      <CardHeader className="border-b border-[#1A1B4B]/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ArrowRight className="h-5 w-5 text-[#26A649]" />
            <div>
              <CardTitle className="text-[#1A1B4B]">Upgrade Your Plan</CardTitle>
              <CardDescription className="text-[#1A1B4B]/60">
                Get more from your subscription
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <SubscribePlan />
      </CardContent>
    </Card>
  );
}
