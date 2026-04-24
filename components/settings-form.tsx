"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const settingsFormSchema = z.object({
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;
type SettingsUser = {
  settings?: {
    marketing_emails?: boolean;
  };
};

export function SettingsForm({ user }: { user: SettingsUser }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      marketing_emails: user?.settings?.marketing_emails || false,
      security_emails: true,
    },
  });

  async function onSubmit(data: SettingsFormValues) {
    setIsLoading(true);

    const response = await fetch("/api/user/settings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    setIsLoading(false);

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your settings were not updated. Please try again.",
        variant: "destructive",
      });
    }

    toast({
      description: "Your settings have been updated.",
    });
  }

  return (
    <Card className="border-[#1A1B4B]/20 bg-[#FFFFFF]">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="marketing_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-[#1A1B4B]">Marketing emails</FormLabel>
                    <FormDescription className="text-[#1A1B4B]/60">
                      Receive emails about new products, features, and more.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="security_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-[#1A1B4B]">Security emails</FormLabel>
                    <FormDescription className="text-[#1A1B4B]/60">
                      Receive emails about your account security.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#1A1B4B] text-[#FFFFFF] hover:bg-[#1A1B4B]/90"
            >
              {isLoading ? "Updating..." : "Update settings"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
