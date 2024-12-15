import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Providers } from "./providers";
import "./globals.css";
import { getSession } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <Providers session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-svh flex-col bg-background px-4">
              <Header />
              {session ? (
                <main className="flex-1 max-w-screen-xl mx-auto w-full">
                  {children}
                </main>
              ) : (
                <main className="flex-1 px-4 md:px-8 lg:px-16 xl:px-32 max-w-screen-xl mx-auto w-full">
                  {children}
                </main>
              )}
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
