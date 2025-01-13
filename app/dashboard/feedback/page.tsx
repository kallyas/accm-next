import { UserFeedback } from "@/components/user/user-feedback";

export default function UserFeedbackPage() {
  return (
    <div className="container max-w-4xl py-10">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Feedback</h1>
        <p className="text-muted-foreground">
          We value your feedback. Help us improve by sharing your thoughts.
        </p>
      </div>
      <UserFeedback />
    </div>
  );
}
