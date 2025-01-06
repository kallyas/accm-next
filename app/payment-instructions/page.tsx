import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentInstructionsPage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Payment Instructions</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Follow these steps to complete your payment for our services.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Credit Card Payment</CardTitle>
            <CardDescription>Secure and instant payment</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>Select your desired service on the Services page</li>
              <li>Click on the &quot;Subscribe&quot; button</li>
              <li>You will be redirected to our secure payment gateway</li>
              <li>Enter your credit card details</li>
              <li>Review and confirm your payment</li>
              <li>You&apos;ll receive a confirmation email upon successful payment</li>
            </ol>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bank Transfer</CardTitle>
            <CardDescription>For those who prefer traditional methods</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please use the following bank details for transfer:</p>
            <ul className="space-y-2">
              <li><strong>Bank Name:</strong> Example Bank</li>
              <li><strong>Account Name:</strong> African Centre For Career Mentorship</li>
              <li><strong>Account Number:</strong> 1234567890</li>
              <li><strong>Sort Code:</strong> 12-34-56</li>
              <li><strong>Reference:</strong> Your full name</li>
            </ul>
            <p className="mt-4">After making the transfer, please email a copy of the transaction to admin@africanccm.com</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

