"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export function RegisterButton({ eventId }: { eventId: string }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        throw new Error("Failed to register for the event");
      }

      toast({
        title: "Registered Successfully",
        description: "You have been registered for the event.",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register for the event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Button onClick={handleRegister} disabled={isRegistering}>
      {isRegistering ? "Registering..." : "Register for Event"}
    </Button>
  );
}
