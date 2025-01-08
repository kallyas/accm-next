"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubscribePlan } from "../user/subscribe-plan";

export function UpgradeOptions() {
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
        <SubscribePlan />
      </CardContent>
    </Card>
  );
}
