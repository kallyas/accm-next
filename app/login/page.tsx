"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  ArrowUpRight,
  Lock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Users,
  GraduationCap,
  Building,
  BarChart3,
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const callbackUrl = (() => {
    const raw = params.get("callbackUrl");
    if (!raw) return "/dashboard";
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  })();

  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email: values.email.toLowerCase().trim(),
      password: values.password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
      return;
    }

    router.replace(callbackUrl || "/dashboard");
    router.refresh();
  };

  return (
    <div className="bg-white text-[#1A1B4B]">
      <div className="min-h-screen flex">
        <AnimatePresence mode="wait">
          {showBenefits ? (
            <motion.div
              key="benefits"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="hidden lg:flex lg:w-[55%] relative bg-[#1A1B4B] p-10 flex-col justify-between"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent_50%)]" />
                <div className="absolute bottom-20 left-10 w-72 h-72 bg-[#26A649]/20 rounded-full blur-3xl" />
                <div className="absolute top-20 right-10 w-96 h-96 bg-[#26A649]/10 rounded-full blur-3xl" />
              </div>

              <button
                onClick={() => setShowBenefits(false)}
                className="absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center border border-white/20 bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="relative z-10">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#26A649]">
                  Why join ACCM
                </p>
                <h2 className="mt-4 text-balance text-[clamp(1.8rem,3.5vw,3.2rem)] font-semibold uppercase leading-tight text-white">
                  Transform your career trajectory.
                </h2>
              </div>

              <div className="relative z-10 space-y-6">
                {[
                  { icon: Users, label: "One-on-one mentorship" },
                  { icon: GraduationCap, label: "Scholarship coaching" },
                  { icon: Building, label: "Career resources" },
                  { icon: BarChart3, label: "Progress tracking" },
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.08 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center border border-white/20 bg-white/5">
                      <benefit.icon className="h-5 w-5 text-white/70" />
                    </div>
                    <span className="text-sm font-medium uppercase tracking-wide text-white/70">
                      {benefit.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-4 pt-10 border-t border-white/20">
                {[
                  { value: "10,000+", label: "Professionals" },
                  { value: "98%", label: "Success rate" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-semibold text-white">{stat.value}</p>
                    <p className="text-xs uppercase tracking-wider text-white/50">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="hidden lg:flex lg:w-[55%] relative flex-col justify-center p-10 lg:p-20 bg-[#ece8df]"
            >
              <div className="max-w-lg mx-auto space-y-8">
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#1A1B4B]/50">
                    <Lock className="mr-2 h-3.5 w-3.5 inline" />
                    Members only
                  </p>
                  <h1 className="mt-4 text-balance text-[clamp(2rem,4vw,3.5rem)] font-semibold uppercase leading-[0.98] text-[#1A1B4B]">
                    Welcome back.
                  </h1>
                  <p className="mt-4 text-sm leading-7 text-[#1A1B4B]/70">
                    Sign in to continue your career transformation journey.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { count: "10,000+", label: "Professionals mentored" },
                    { count: "500+", label: "Scholarships secured" },
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

                <button
                  onClick={() => setShowBenefits(true)}
                  className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-[#1A1B4B] underline decoration-[#1A1B4B]/40 underline-offset-4"
                >
                  View membership benefits
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => setShowBenefits(true)}
                className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center border border-[#1A1B4B]/20 bg-white/70 text-[#1A1B4B] transition-colors hover:bg-[#1A1B4B]/10"
              >
                <Sparkles className="h-5 w-5" />
              </button>
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

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-[0.65rem] uppercase tracking-[0.14em] text-[#1A1B4B]/60">
                          Password
                        </FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#1A1B4B] underline decoration-[#1A1B4B]/40 underline-offset-4"
                        >
                          Forgot?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="current-password"
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
                  {isSubmitting ? "Signing in..." : "Sign in"}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm text-[#1A1B4B]/70">
              No account yet?&nbsp;
              <Link
                href="/register"
                className="font-semibold uppercase tracking-wider text-[#1A1B4B] underline decoration-[#1A1B4B]/40 underline-offset-4"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}