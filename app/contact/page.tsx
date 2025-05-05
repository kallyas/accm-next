"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Users,
  MessageSquare,
  Briefcase,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { useContact } from "@/hooks/use-contact";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  }

  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="py-10">
      {/* Hero Section */}
      <section className="relative mb-16 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-teal-500/90 z-10" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-20 py-16 md:py-24 text-white">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Let's Connect</h1>
            <p className="text-lg md:text-xl mb-8">
              Have questions about our mentorship programs or want to discuss how we can help your career growth? Get in touch with our team.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Phone, text: "+447 570 224 173" },
                { icon: Mail, text: "admin@africanccm.com" },
              ].map((item, index) => (
                <div key={index} className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <item.icon className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-10 lg:grid-cols-2"
        >
          {/* Form Column */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-blue-100 dark:border-blue-900/50 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-teal-500 w-full"></div>
              <CardHeader>
                <CardTitle className="text-2xl text-gradient-primary">Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your full name" 
                                {...field} 
                                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm" 
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
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your email address" 
                                {...field} 
                                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm" 
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
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="What is your message about?" 
                              {...field} 
                              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm" 
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
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us how we can help you..."
                              {...field}
                              rows={7}
                              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="bg-gradient-primary hover:from-blue-700 hover:to-teal-600 text-white"
                    >
                      {contactMutation.isPending ? (
                        <div className="flex items-center">
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Column */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-md border-blue-100 dark:border-blue-900/50 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-teal-500 w-full"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-gradient-primary">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <ContactInfoItem 
                    icon={MapPin} 
                    title="Our Location"
                    detail="Plot 153, Kira Road, Kampala, Uganda"
                    color="blue"
                  />
                  <ContactInfoItem 
                    icon={Phone} 
                    title="Phone Number"
                    detail="+447 570 224 173"
                    link="tel:+447570224173"
                    color="teal"
                  />
                  <ContactInfoItem 
                    icon={Mail} 
                    title="Email Address"
                    detail="admin@africanccm.com"
                    link="mailto:admin@africanccm.com"
                    color="purple"
                  />
                  <ContactInfoItem 
                    icon={Clock} 
                    title="Operating Hours"
                    detail="Monday - Friday: 9am - 5pm"
                    color="green"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        {/* Map Section - Full Width */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10"
        >
          <Card className="shadow-md border-blue-100 dark:border-blue-900/50 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-teal-500 w-full"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-gradient-primary">Our Location</CardTitle>
              <CardDescription>
                Visit us at Plot 153, Kira Road, Kampala, Uganda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden shadow-inner border border-blue-100 dark:border-blue-900/50 h-[400px] md:h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3989.7468313008358!2d32.59352!3d0.34298999999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMMKwMjAnMzQuOCJOIDMywrAzNSczNi43IkU!5e0!3m2!1sen!2sug!4v1736110635232!5m2!1sen!2sug"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Sections */}
        <div className="mt-20">
          {/* Ways to Connect */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gradient-primary">Ways to Connect</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Looking for different ways to engage with our team? Choose the option that works best for you.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Users,
                  title: "Mentorship Programs",
                  description: "Inquire about our personalized mentorship opportunities.",
                  link: "/mentors",
                  color: "blue",
                },
                {
                  icon: Briefcase,
                  title: "Career Services",
                  description: "Learn about our professional development programs.",
                  link: "/services",
                  color: "teal",
                },
                {
                  icon: MessageSquare,
                  title: "Community Support",
                  description: "Connect with our community support team.",
                  link: "/community",
                  color: "purple",
                },
                {
                  icon: CheckCircle,
                  title: "Scholarship Quest",
                  description: "Get information about scholarship opportunities.",
                  link: "/scholarship-quest",
                  color: "green",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-lg group border-blue-100/50 dark:border-blue-900/30">
                    <CardHeader className="pb-2">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                        item.color === "blue" && "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
                        item.color === "teal" && "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
                        item.color === "purple" && "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
                        item.color === "green" && "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                      )}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col h-full">
                      <p className="text-muted-foreground mb-4 flex-grow">{item.description}</p>
                      <Link 
                        href={item.link} 
                        className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        Learn more
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* FAQ and CTA Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-teal-500/90 z-10" />
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10 mix-blend-overlay"></div>
              <div className="relative z-20 py-16 px-6 text-center text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Career?</h2>
                <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
                  Join thousands of professionals who have accelerated their careers through our mentorship programs.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    <Link href="/register">Get Started</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Link href="/services">Explore Our Services</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

// Helper component for contact info items
function ContactInfoItem({ 
  icon: Icon, 
  title, 
  detail, 
  link, 
  color = "blue" 
}: {
  icon: React.ElementType;
  title: string;
  detail: string;
  link?: string;
  color?: "blue" | "teal" | "purple" | "green";
}) {
  const Content = () => (
    <div className="flex gap-4">
      <div className="mt-1">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          color === "blue" && "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
          color === "teal" && "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
          color === "purple" && "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
          color === "green" && "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-base font-medium">{detail}</p>
      </div>
    </div>
  );

  return link ? (
    <a 
      href={link} 
      className="block transition-colors hover:text-blue-600 dark:hover:text-blue-400"
    >
      <Content />
    </a>
  ) : (
    <Content />
  );
}