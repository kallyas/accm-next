"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

// Types
interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  password: string;
  token: string;
}

// API functions
async function forgotPassword(data: ForgotPasswordRequest) {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to send reset email");
  }

  return response.json();
}

async function resetPassword(data: ResetPasswordRequest) {
  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to reset password");
  }

  return response.json();
}

export function useAuth() {
  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send password reset email. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your password has been successfully reset.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    forgotPasswordMutation,
    resetPasswordMutation,
  };
}
