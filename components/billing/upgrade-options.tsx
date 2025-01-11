"use client";

import { ArrowRight, AlertCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SubscribePlan } from "../user/subscribe-plan";

export function UpgradeOptions() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ArrowRight className="w-5 h-5 text-gray-500" />
            <div>
              <CardTitle>Upgrade Your Plan</CardTitle>
              <CardDescription>Get more from your subscription</CardDescription>
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
