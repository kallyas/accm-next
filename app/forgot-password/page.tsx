"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, KeyRound, MailCheck, ArrowRight, Sparkles } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setSubmittedEmail(values.email);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setEmailSent(true);

    toast({
      title: "Email sent",
      description: "Check your inbox for reset instructions.",
    });
  };

  return (
    <div className="bg-white text-[#1A1B4B]">
      <div className="min-h-screen flex">
        <AnimatePresence mode="wait">
          {emailSent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:flex lg:w-[55%] relative bg-[#1A1B4B] p-10 flex-col justify-center items-center"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent_50%)]" />
                <div className="absolute bottom-20 left-10 w-72 h-72 bg-[#26A649]/20 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10 text-center max-w-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-white/20 bg-white/10">
                  <MailCheck className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold uppercase tracking-tight text-white">
                  Check your email
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  We sent a password reset link to {submittedEmail}
                </p>
                <p className="mt-6 text-xs leading-5 text-white/50">
                  The link will expire in 24 hours. If you don&apos;t see it,
                  check your spam folder.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="hidden lg:flex lg:w-[55%] relative flex-col justify-center p-10 lg:p-20 bg-[#ece8df]"
            >
              <div className="max-w-lg mx-auto space-y-8">
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#1A1B4B]/50">
                    <KeyRound className="mr-2 h-3.5 w-3.5 inline" />
                    Account recovery
                  </p>
                  <h1 className="mt-4 text-balance text-[clamp(2rem,4vw,3.5rem)] font-semibold uppercase leading-[0.98] text-[#1A1B4B]">
                    Forgot your password?
                  </h1>
                  <p className="mt-4 text-sm leading-7 text-[#1A1B4B]/70">
                    No worries. Enter your email and we&apos;ll send you a link to
                    reset your password.
                  </p>
                </div>

                <div className="grid gap-4">
                  {[
                    { count: "10,000+", label: "Users secured" },
                    { count: "24/7", label: "Support available" },
                  ].map((stat, index) => (
                    <div
                      key={stat.label}
                      className={`border border-[#1A1B4B]/20 bg-white/70 p-4 ${
                        index === 1 ? "sm:translate-y-4" : ""
                      }`}
                    >
                      <p className="text-xl font-semibold text-[#1A1B4B]">
                        {stat.count}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#1A1B4B]/50">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex items-center justify-center p-8 lg:p-20">
          <div className="w-full max-w-sm space-y-8">
            <div className="text-center lg:text-left">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-lg font-semibold uppercase tracking-wider"
              >
                <Sparkles className="h-5 w-5" />
                ACCM
              </Link>
            </div>

            <AnimatePresence mode="wait">
              {emailSent ? (
                <motion.div
                  key="success-mobile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="border border-[#1A1B4B]/20 bg-[#ece8df]/50 p-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-[#1A1B4B]/20 bg-white">
                      <MailCheck className="h-6 w-6 text-[#26A649]" />
                    </div>
                    <h2 className="text-lg font-semibold uppercase">
                      Check your email
                    </h2>
                    <p className="mt-2 text-sm text-[#1A1B4B]/60">
                      We sent a reset link to {submittedEmail}
                    </p>
                    <button
                      onClick={() => {
                        setEmailSent(false);
                        form.reset();
                      }}
                      className="mt-4 text-xs font-medium uppercase tracking-wider text-[#1A1B4B] underline decoration-[#1A1B4B]/40 underline-offset-4"
                    >
                      Send to different email
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[0.65rem] uppercase tracking-[0.14em] text-[#1A1B4B]/60">
                              Email address
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                {...field}
                                className="h-11 rounded-none border-[#1A1B4B]/20 bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-11 w-full rounded-none bg-[#1A1B4B] text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white hover:bg-[#1A1B4B]/90"
                      >
                        {isSubmitting ? "Sending..." : "Send reset link"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-center text-sm text-[#1A1B4B]/70">
              Remember password?&nbsp;
              <Link
                href="/login"
                className="font-semibold uppercase tracking-wider text-[#1A1B4B] underline decoration-[#1A1B4B]/40 underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}