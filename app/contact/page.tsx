"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import type { ElementType } from "react";
import * as z from "zod";
import {
  Briefcase,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useContact } from "@/hooks/use-contact";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const connectOptions = [
  {
    icon: Users,
    title: "Mentorship Programs",
    description: "Ask about one-to-one and cohort-based mentorship options.",
    link: "/mentors",
  },
  {
    icon: Briefcase,
    title: "Career Services",
    description: "Explore practical services for growth and transitions.",
    link: "/services",
  },
  {
    icon: MessageSquare,
    title: "Community Support",
    description: "Connect with our team for guidance and onboarding help.",
    link: "/community",
  },
  {
    icon: CheckCircle,
    title: "Scholarship Quest",
    description: "Get guidance on scholarship pathways and readiness.",
    link: "/scholarship-quest",
  },
];

export default function ContactPage() {
  const contactMutation = useContact();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await contactMutation.mutateAsync(values);
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible.",
      });
      form.reset();
    } catch {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  }

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
                Contact
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="mt-4 text-balance text-[clamp(1.9rem,4.2vw,3.8rem)] font-semibold uppercase leading-[0.98]"
              >
                Let us shape your next career move.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-5 max-w-[58ch] text-sm leading-8 text-gray-700 dark:text-gray-300"
              >
                Have questions about mentorship, scholarship support, or career
                services? Reach out and we will guide you to the right pathway.
              </motion.p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <a
                  href="tel:+447570224173"
                  className="border border-gray-300 bg-white/70 px-4 py-3 text-sm leading-6 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-[#121618] dark:text-gray-300 dark:hover:bg-[#1b2022]"
                >
                  <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                    Phone
                  </span>
                  +447 570 224 173
                </a>
                <a
                  href="mailto:admin@africanccm.com"
                  className="border border-gray-300 bg-white/70 px-4 py-3 text-sm leading-6 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-[#121618] dark:text-gray-300 dark:hover:bg-[#1b2022]"
                >
                  <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                    Email
                  </span>
                  admin@africanccm.com
                </a>
              </div>
            </div>

            <div className="relative min-h-[22rem] border-t border-gray-300 dark:border-gray-800 lg:border-l lg:border-t-0">
              <iframe
                src="https://maps.google.com/maps?q=Conrad%20Plaza%2C%207th%20Floor%2C%20above%20ISBAT%20University%20%28City%20Campus%29%2C%20Next%20to%20Andro%20Smart%20Options%20LTD%2C%20Kampala%2C%20Uganda&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ACCM Location Map"
                className="absolute inset-0"
              />
            </div>
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="space-y-5">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                Contact information
              </p>
              <div className="space-y-3">
                <InfoRow
                  icon={MapPin}
                  label="Location"
                  value="Conrad Plaza, 7th Floor, above ISBAT University (City Campus), Next to Andro Smart Options LTD"
                />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value="+447 570 224 173"
                  href="tel:+447570224173"
                />
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value="admin@africanccm.com"
                  href="mailto:admin@africanccm.com"
                />
                <InfoRow
                  icon={Clock}
                  label="Operating Hours"
                  value="Monday - Friday: 9am - 5pm"
                />
              </div>
            </div>

            <article className="border border-gray-300 bg-white/70 p-6 dark:border-gray-800 dark:bg-[#171b1d]">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                Send a message
              </p>
              <h2 className="mt-3 text-xl font-semibold uppercase tracking-[0.03em]">
                We respond as quickly as possible.
              </h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mt-6 space-y-5"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[0.65rem] uppercase tracking-[0.14em] text-gray-600 dark:text-gray-400">
                            Your name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                              className="rounded-none border-gray-300 bg-white dark:border-gray-700 dark:bg-[#111416]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[0.65rem] uppercase tracking-[0.14em] text-gray-600 dark:text-gray-400">
                            Email address
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your email address"
                              {...field}
                              className="rounded-none border-gray-300 bg-white dark:border-gray-700 dark:bg-[#111416]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[0.65rem] uppercase tracking-[0.14em] text-gray-600 dark:text-gray-400">
                          Subject
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="What is your message about?"
                            {...field}
                            className="rounded-none border-gray-300 bg-white dark:border-gray-700 dark:bg-[#111416]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[0.65rem] uppercase tracking-[0.14em] text-gray-600 dark:text-gray-400">
                          Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us how we can help you..."
                            {...field}
                            rows={7}
                            className="resize-none rounded-none border-gray-300 bg-white dark:border-gray-700 dark:bg-[#111416]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="h-10 rounded-none bg-gray-900 px-5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                  >
                    {contactMutation.isPending ? (
                      <span className="inline-flex items-center">
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Sending
                      </span>
                    ) : (
                      <span className="inline-flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        Send message
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </article>
          </div>
        </section>

        <section className="border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-16">
          <div className="mb-8">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
              Ways to connect
            </p>
            <h2 className="mt-2 text-balance text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold uppercase leading-tight">
              Choose the support route that fits your current need.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {connectOptions.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.32, delay: index * 0.05 }}
                className={`border border-gray-300 bg-white/70 p-5 dark:border-gray-800 dark:bg-[#171b1d] ${
                  index === 1 ? "lg:translate-y-6" : ""
                }`}
              >
                <item.icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.06em]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-300">
                  {item.description}
                </p>
                <Link
                  href={item.link}
                  className="mt-4 inline-flex text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-gray-700 underline decoration-gray-400 underline-offset-4 dark:text-gray-200 dark:decoration-gray-600"
                >
                  Learn more
                </Link>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="border border-t-0 border-gray-300 dark:border-gray-800">
          <div className="grid md:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-[#171b1d] px-6 py-10 text-gray-100 sm:px-10">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-400">
                Ready when you are
              </p>
              <h2 className="mt-3 text-balance text-[clamp(1.6rem,3vw,2.7rem)] font-semibold uppercase leading-tight">
                Start your professional growth journey with ACCM.
              </h2>
              <p className="mt-4 max-w-[48ch] text-sm leading-8 text-gray-300">
                Join thousands of professionals accelerating their careers
                through structured mentorship and practical support.
              </p>
            </div>
            <div className="flex items-center justify-center bg-[#ece8df] p-6 dark:bg-[#0f1315] sm:p-10">
              <div className="w-full max-w-sm space-y-3">
                <Button
                  asChild
                  className="h-10 w-full rounded-none bg-gray-900 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  <Link href="/register">Get started</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="h-10 w-full rounded-none border border-gray-300 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-700 hover:bg-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <Link href="/services">Explore services</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="border border-gray-300 bg-white/70 p-4 dark:border-gray-800 dark:bg-[#171b1d]">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 text-gray-700 dark:text-gray-300" />
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <p className="mt-1 text-sm leading-7 text-gray-700 dark:text-gray-300">
            {value}
          </p>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block transition-opacity hover:opacity-85">
        {content}
      </a>
    );
  }

  return content;
}
