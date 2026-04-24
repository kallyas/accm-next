import { UserFeedback } from "@/components/user/user-feedback";

export default function UserFeedbackPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-2 mb-8">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#26A649]">
          Experience
        </p>
        <h1 className="text-2xl font-semibold uppercase tracking-tight text-[#1A1B4B] sm:text-3xl">
          Feedback
        </h1>
        <p className="text-sm text-[#1A1B4B]/60">
          We value your feedback. Help us improve by sharing your thoughts.
        </p>
      </div>
      <UserFeedback />
    </div>
  );
}
