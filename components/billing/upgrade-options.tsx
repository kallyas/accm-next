"use client";

import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
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
  const [selectedCycle, setSelectedCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const plans = [
    {
      name: "Starter",
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        "Basic features",
        "Up to 5 users",
        "10GB storage",
        "Email support",
      ],
    },
    {
      name: "Professional",
      monthlyPrice: 59,
      yearlyPrice: 590,
      features: [
        "All Starter features",
        "Up to 20 users",
        "50GB storage",
        "Priority support",
      ],
    },
    {
      name: "Enterprise",
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        "All Pro features",
        "Unlimited users",
        "Unlimited storage",
        "24/7 support",
      ],
    },
  ];

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
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <Button
              variant={selectedCycle === "monthly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCycle("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={selectedCycle === "yearly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCycle("yearly")}
            >
              Yearly (Save 15%)
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <SubscribePlan />
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                Need help choosing?
              </p>
              <p className="text-gray-500">
                Contact our sales team for a personalized recommendation.
              </p>
              <Button variant="link" className="p-0 h-auto mt-1">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
