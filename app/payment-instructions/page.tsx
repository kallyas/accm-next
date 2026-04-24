"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  CopyIcon,
  DollarSignIcon,
  InfoIcon,
  LandmarkIcon,
  SmartphoneIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function PaymentInstructionsPage() {
  const [activeCopyStates, setActiveCopyStates] = useState<Record<string, boolean>>(
    {}
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setActiveCopyStates((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setActiveCopyStates((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="bg-[#f7f5f1] text-gray-900 dark:bg-[#111416] dark:text-gray-100">
      <main className="mx-auto w-full max-w-[88rem] px-5 py-10 sm:px-7 lg:px-10">
        <section className="border border-gray-300 dark:border-gray-800">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="bg-[#ece8df] p-7 dark:bg-[#171b1d] sm:p-10">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400"
              >
                Payments
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="mt-4 text-balance text-[clamp(1.9rem,4.2vw,3.8rem)] font-semibold uppercase leading-[0.98]"
              >
                Complete your subscription securely.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-5 max-w-[58ch] text-sm leading-8 text-gray-700 dark:text-gray-300"
              >
                Choose the payment channel that fits you. Copy details directly,
                make payment, then upload confirmation on your billing page.
              </motion.p>
            </div>
            <div className="flex flex-col justify-between border-t border-gray-300 bg-[#171b1d] p-7 text-gray-100 dark:border-gray-800 sm:p-10 lg:border-l lg:border-t-0">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Important
                </p>
                <p className="mt-3 text-sm leading-8 text-gray-300">
                  After payment, upload your transaction proof under your active
                  subscription for verification.
                </p>
              </div>
              <Button
                asChild
                className="mt-8 h-10 rounded-none bg-gray-100 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-900 hover:bg-gray-200"
              >
                <Link href="/dashboard/billing">
                  Go to billing
                  <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-16">
          <Tabs defaultValue="mobile" className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-3 rounded-none border border-gray-300 bg-white/60 p-1 dark:border-gray-800 dark:bg-[#171b1d]">
              <TabsTrigger
                value="mobile"
                className="rounded-none border border-transparent py-3 data-[state=active]:border-gray-300 data-[state=active]:bg-[#ece8df] dark:data-[state=active]:border-gray-700 dark:data-[state=active]:bg-[#111416]"
              >
                <SmartphoneIcon className="mr-2 h-4 w-4" />
                Mobile Money
              </TabsTrigger>
              <TabsTrigger
                value="bank"
                className="rounded-none border border-transparent py-3 data-[state=active]:border-gray-300 data-[state=active]:bg-[#ece8df] dark:data-[state=active]:border-gray-700 dark:data-[state=active]:bg-[#111416]"
              >
                <LandmarkIcon className="mr-2 h-4 w-4" />
                Bank Transfer
              </TabsTrigger>
              <TabsTrigger
                value="international"
                className="rounded-none border border-transparent py-3 data-[state=active]:border-gray-300 data-[state=active]:bg-[#ece8df] dark:data-[state=active]:border-gray-700 dark:data-[state=active]:bg-[#111416]"
              >
                <DollarSignIcon className="mr-2 h-4 w-4" />
                International
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mobile" className="mt-5">
              <PaymentPanel
                title="Mobile Money"
                subtitle="Most preferred method in Uganda"
                accent="green"
                eta="Instant confirmation"
                note="After sending money, save the transaction reference number for payment confirmation."
                rows={[
                  {
                    id: "mobile-phone",
                    label: "Phone Number",
                    value: "+256752206865",
                  },
                  {
                    id: "mobile-name",
                    label: "Account Name",
                    value: "Abel Wilson Walekhwa",
                  },
                ]}
                activeCopyStates={activeCopyStates}
                onCopy={handleCopy}
              />
            </TabsContent>

            <TabsContent value="bank" className="mt-5">
              <PaymentPanel
                title="Bank Transfer"
                subtitle="Local bank transfer in Uganda"
                accent="blue"
                eta="1-2 business days"
                note="Bank transfers may take 1-2 business days to process. Include your name as reference."
                rows={[
                  {
                    id: "bank-name",
                    label: "Bank Name",
                    value: "Centenary Rural Development Bank",
                  },
                  {
                    id: "bank-account-name",
                    label: "Account Name",
                    value: "AFRICAN CENTER FOR CAREER MENTORSHIP",
                  },
                  {
                    id: "bank-account-number",
                    label: "Account Number",
                    value: "3203652885",
                  },
                  {
                    id: "bank-branch",
                    label: "Branch",
                    value: "Mbale",
                  },
                ]}
                activeCopyStates={activeCopyStates}
                onCopy={handleCopy}
              />
            </TabsContent>

            <TabsContent value="international" className="mt-5">
              <PaymentPanel
                title="International Transfer"
                subtitle="US Dollar account details"
                accent="purple"
                eta="3-5 business days"
                note="International transfers may take 3-5 business days. Include complete beneficiary details to avoid delays."
                rows={[
                  { id: "intl-currency", label: "Currency", value: "US Dollar" },
                  { id: "intl-beneficiary", label: "Beneficiary", value: "ABEL WALEKHWA" },
                  {
                    id: "intl-account-number",
                    label: "Account Number",
                    value: "217535467566",
                  },
                  {
                    id: "intl-ach",
                    label: "ACH Routing Number",
                    value: "101019644",
                  },
                  {
                    id: "intl-wire",
                    label: "Wire Routing Number",
                    value: "101019644",
                  },
                  { id: "intl-bank-name", label: "Bank Name", value: "Lead Bank" },
                  {
                    id: "intl-bank-address",
                    label: "Bank Address",
                    value: "1801 Main Street, Kansas City, MO, 64108, United States",
                  },
                ]}
                activeCopyStates={activeCopyStates}
                onCopy={handleCopy}
              />
            </TabsContent>
          </Tabs>
        </section>

        <section className="border border-t-0 border-gray-300 dark:border-gray-800">
          <div className="grid md:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-[#171b1d] px-6 py-10 text-gray-100 sm:px-10">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-400">
                Confirmation
              </p>
              <h2 className="mt-3 text-balance text-[clamp(1.6rem,3vw,2.7rem)] font-semibold uppercase leading-tight">
                Upload your receipt to complete verification.
              </h2>
              <p className="mt-4 max-w-[48ch] text-sm leading-8 text-gray-300">
                Once payment is made, upload your transaction proof against the
                subscription you are paying for.
              </p>
            </div>
            <div className="flex items-center justify-center bg-[#ece8df] p-6 dark:bg-[#0f1315] sm:p-10">
              <Button
                asChild
                className="h-10 w-full max-w-sm rounded-none bg-gray-900 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
              >
                <Link href="/dashboard/billing">
                  Upload receipt
                  <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function PaymentPanel({
  title,
  subtitle,
  rows,
  note,
  eta,
  accent,
  activeCopyStates,
  onCopy,
}: {
  title: string;
  subtitle: string;
  rows: { id: string; label: string; value: string }[];
  note: string;
  eta: string;
  accent: "green" | "blue" | "purple";
  activeCopyStates: Record<string, boolean>;
  onCopy: (text: string, id: string) => void;
}) {
  return (
    <article className="border border-gray-300 bg-white/70 p-6 dark:border-gray-800 dark:bg-[#171b1d]">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
          <h2 className="mt-1 text-xl font-semibold uppercase tracking-[0.03em]">
            {title}
          </h2>
        </div>
        <div className="inline-flex items-center border border-gray-300 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-gray-600 dark:border-gray-700 dark:text-gray-300">
          <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
          {eta}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {rows.map((row) => (
          <PaymentDetail
            key={row.id}
            label={row.label}
            value={row.value}
            accent={accent}
            isCopied={!!activeCopyStates[row.id]}
            onCopy={() => onCopy(row.value, row.id)}
          />
        ))}
      </div>

      <div className="mt-5 border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-800/30 dark:bg-amber-900/10">
        <p className="flex gap-2 text-sm leading-7 text-amber-800 dark:text-amber-300">
          <InfoIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
          {note}
        </p>
      </div>
    </article>
  );
}

function PaymentDetail({
  label,
  value,
  accent,
  isCopied,
  onCopy,
}: {
  label: string;
  value: string;
  accent: "green" | "blue" | "purple";
  isCopied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-[#111416]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 rounded-none border border-transparent px-2 text-xs",
            accent === "green" && "text-green-700 dark:text-green-300",
            accent === "blue" && "text-blue-700 dark:text-blue-300",
            accent === "purple" && "text-purple-700 dark:text-purple-300"
          )}
          onClick={onCopy}
        >
          {isCopied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <p className="mt-2 break-all text-sm font-medium leading-7 text-gray-800 dark:text-gray-100">
        {value}
      </p>
    </div>
  );
}
