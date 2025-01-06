import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SmartphoneIcon,
  LandmarkIcon,
  GlobeIcon,
  DollarSignIcon,
} from "lucide-react";
import Link from "next/link";

export default function PaymentInstructionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-background">
      <div className="container py-10 px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Payment Instructions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your preferred payment method to complete your transaction
            securely.
          </p>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Mobile Money Card */}
          <Card className="group hover:shadow-md transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/90 to-green-600/90 dark:from-green-500/70 dark:to-green-600/70">
                  <SmartphoneIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>Mobile Money</CardTitle>
                  <CardDescription>Most Preferred Method</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/10">
                  <p className="font-semibold text-green-700 dark:text-green-300">
                    Send to:
                  </p>
                  <div className="mt-2 space-y-2 text-green-600 dark:text-green-200">
                    <p>+256752206865</p>
                    <p className="text-sm">Name: Abel Wilson Walekhwa</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Local Bank Transfer Card */}
          <Card className="group hover:shadow-md transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/90 to-blue-600/90 dark:from-blue-500/70 dark:to-blue-600/70">
                  <LandmarkIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>Bank Transfer</CardTitle>
                  <CardDescription>Local Bank Transfer</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10">
                  <ul className="space-y-2 text-blue-700 dark:text-blue-200">
                    <li>
                      <strong>Bank Name:</strong> Centenary Rural Development
                      Bank
                    </li>
                    <li>
                      <strong>Account Name:</strong> AFRICAN CENTER FOR CAREER
                      MENTORSHIP
                    </li>
                    <li>
                      <strong>Account Number:</strong> 3203652885
                    </li>
                    <li>
                      <strong>Branch:</strong> Mbale
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* International Transfer Card */}
          <Card className="group hover:shadow-md transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/90 to-purple-600/90 dark:from-purple-500/70 dark:to-purple-600/70">
                  <DollarSignIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>International Transfer</CardTitle>
                  <CardDescription>US Dollar Account</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/10">
                <div className="space-y-4">
                  <div className="space-y-2 text-purple-700 dark:text-purple-200">
                    <p>
                      <strong>Currency:</strong> US Dollar
                    </p>
                    <p>
                      <strong>Beneficiary:</strong> ABEL WALEKHWA
                    </p>
                    <p>
                      <strong>Account Number:</strong> 217535467566
                    </p>
                    <p>
                      <strong>ACH Routing Number:</strong> 101019644
                    </p>
                    <p>
                      <strong>Wire Routing Number:</strong> 101019644
                    </p>
                  </div>

                  <div className="pt-2 border-t border-purple-100 dark:border-purple-800">
                    <p className="font-semibold mb-2">Bank Information:</p>
                    <div className="space-y-2 text-purple-700 dark:text-purple-200">
                      <p>
                        <strong>Bank Name:</strong> Lead Bank
                      </p>
                      <p>
                        <strong>Bank Address:</strong>
                      </p>
                      <p className="pl-4">1801 Main Street</p>
                      <p className="pl-4">Kansas City, MO, 64108</p>
                      <p className="pl-4">United States</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="mt-12 max-w-2xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                After making the payment, please upload the payment receipt
                against the Subscription you are paying for. You can do this on
                the{" "}
                <Link
                  href="/dashboard/billing"
                  className="text-primary hover:underline"
                >
                  Subscriptions Page
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
