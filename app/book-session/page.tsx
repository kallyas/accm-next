"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

declare global {
  interface Window {
    Calendly: any;
  }
}

export default function BookSessionPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const getIframes = setInterval(() => {
      const iframe = document.querySelector("iframe");
      if (iframe) {
        iframe.style.borderRadius = "0.5rem";
        iframe.style.backgroundColor = "#0a0a0a";
        clearInterval(getIframes);
      }
    }, 1000);
  }, []);

  return (
    <div className="container py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Book a Session with Abel
          </CardTitle>
          <CardDescription>
            Schedule a one-on-one mentorship session with our founder, Abel
            Wilson Walekhwa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            data-url="https://calendly.com/wabelwilson/30min"
            className="calendly-inline-widget rounded rounded-lg"
            style={{ minWidth: "320px", height: "630px", colorScheme: "dark" }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
