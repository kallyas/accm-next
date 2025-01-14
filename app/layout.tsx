import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Providers } from "./providers";
import "./globals.css";
import { getSession } from "@/lib/auth";
import QueryProvider from "@/components/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mentorship Platform",
  description: "A platform to connect mentors and mentees",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("min-h-screen font-sans antialiased", inter.className)}
      >
        <Providers session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <div className="relative flex min-h-svh flex-col px-4">
                {/* Gradient background layer */}
                <div className="fixed inset-0 -z-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />
                  <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02]" />
                </div>

                <Header />
                <main className="flex-1 max-w-screen-xl mx-auto w-full">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster />
            </QueryProvider>
          </ThemeProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
