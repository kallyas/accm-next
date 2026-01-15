import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ServiceAgreementContent, AGREEMENT_VERSION } from "@/components/service-agreement-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Agreement | ACCM",
  description: "ACCM Responsibility and Availability Agreement for mentees and clients",
};

export default function ServiceAgreementPage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Responsibility and Availability Agreement</h1>
      <Card>
        <CardHeader>
          <CardTitle>ACCM Service Agreement</CardTitle>
          <CardDescription>
            Last updated: January 15, 2026 | Version {AGREEMENT_VERSION}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceAgreementContent />

          <div className="mt-8 pt-6 border-t space-y-4">
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Service Agreement, you can contact us:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>By email: admin@africanccm.com</li>
              <li>CEO and Founder, Abel Walekhwa: +447570224173 (WhatsApp)</li>
              <li>Call: +256752206865</li>
              <li>By visiting: africanccm.com/contact</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
