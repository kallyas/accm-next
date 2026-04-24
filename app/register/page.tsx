"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Users,
  GraduationCap,
  BarChart3,
  Globe,
} from "lucide-react";

const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name must be at least 2 characters."),
    lastName: z.string().trim().min(2, "Last name must be at least 2 characters."),
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm your password."),
    acceptServiceAgreement: z.boolean().refine((value) => value === true, {
      message: "You must accept the agreement to continue.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptServiceAgreement: false,
    },
  });

  const handleSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsSubmitting(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.toLowerCase().trim(),
        password: values.password,
        acceptServiceAgreement: values.acceptServiceAgreement,
      }),
    });

    const payload = await response.json().catch(() => null);
    setIsSubmitting(false);

    if (!response.ok) {
      toast({
        title: "Registration failed",
        description:
          payload?.error === "A user with this email already exists"
            ? "An account with this email already exists."
            : "We could not create your account. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Account created",
      description: "You can now log in.",
    });
    router.push("/login");
  };

  const benefits = [
    { icon: Users, title: "Mentorship", description: "One-on-one guidance from industry professionals" },
    { icon: GraduationCap, title: "Scholarships", description: "Coaching for international applications" },
    { icon: BarChart3, title: "Resources", description: "Career development tools" },
    { icon: Globe, title: "Network", description: "Connect with professionals" },
  ];

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
                  What you&apos;ll get
                </p>
                <h2 className="mt-4 text-balance text-[clamp(1.8rem,3.5vw,3.2rem)] font-semibold uppercase leading-tight text-white">
                  Everything you need to succeed.
                </h2>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.06 }}
                    className={`border border-white/20 bg-white/5 p-5 ${
                      index === 1 ? "lg:translate-y-4" : ""
                    } ${index === 3 ? "lg:-translate-y-2" : ""}`}
                  >
                    <benefit.icon className="h-5 w-5 text-white/70" />
                    <h3 className="mt-3 text-sm font-semibold uppercase tracking-wide text-white">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-white/50">
                      {benefit.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="relative z-10 grid grid-cols-4 gap-4 pt-10 border-t border-white/20">
                {[
                  { value: "10K+", label: "Professionals" },
                  { value: "500+", label: "Scholarships" },
                  { value: "98%", label: "Success" },
                  { value: "13+", label: "Countries" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-xl font-semibold text-white">{stat.value}</p>
                    <p className="text-xs uppercase tracking-wider text-white/50">
                      {stat.label}
                    </p>
                  </div>
                ))}
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
              <div className="max-w-lg mx-auto space-y-10">
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#1A1B4B]/50">
                    <Sparkles className="mr-2 h-3.5 w-3.5 inline" />
                    Get started
                  </p>
                  <h1 className="mt-4 text-balance text-[clamp(2rem,4vw,3.5rem)] font-semibold uppercase leading-[0.98] text-[#1A1B4B]">
                    Start your journey.
                  </h1>
                  <p className="mt-4 text-sm leading-7 text-[#1A1B4B]/70">
                    Join thousands of professionals transforming their careers
                    across Africa.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {benefits.map((benefit, index) => (
                    <div
                      key={benefit.title}
                      className={`flex items-start gap-3 border border-[#1A1B4B]/20 bg-white/70 p-4 ${
                        index === 1 ? "sm:translate-y-4" : ""
                      }`}
                    >
                      <benefit.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1A1B4B]/70" />
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-[#1A1B4B]">
                          {benefit.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowBenefits(true)}
                  className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-[#1A1B4B] underline decoration-[#1A1B4B]/40 underline-offset-4"
                >
                  Learn about membership
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

        <div className="flex-1 flex items-center justify-center p-8 lg:p-20 overflow-y-auto">
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
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[0.65rem] uppercase tracking-[0.14em] text-[#1A1B4B]/60">
                          First name
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="given-name"
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
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[0.65rem] uppercase tracking-[0.14em] text-[#1A1B4B]/60">
                          Last name
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="family-name"
                            {...field}
                            className="h-11 rounded-none border-[#1A1B4B]/20 bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[0.65rem] uppercase tracking-[0.14em] text-[#1A1B4B]/60">
                        Email
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
                      <FormLabel className="text-[0.65rem] uppercase tracking-[0.14em] text-[#1A1B4B]/60">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[0.65rem] uppercase tracking-[0.14em] text-[#1A1B4B]/60">
                        Confirm password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
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
                  name="acceptServiceAgreement"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                            className="mt-0.5 border-[#1A1B4B]/30 rounded-none"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal leading-5 text-[#1A1B4B]/70">
                          I agree to the{" "}
                          <Link
                            href="/service-agreement"
                            className="underline decoration-[#1A1B4B]/40 underline-offset-4"
                          >
                            service agreement
                          </Link>
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-none bg-[#1A1B4B] text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white hover:bg-[#1A1B4B]/90"
                >
                  {isSubmitting ? "Creating..." : "Create account"}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm text-[#1A1B4B]/70">
              Already have an account?&nbsp;
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