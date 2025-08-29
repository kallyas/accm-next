import { Space_Grotesk } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Providers } from "./providers";
import "./globals.css";
import { authOptions } from "@/lib/auth";
import QueryProvider from "@/components/query-provider";
import { getServerSession } from "next-auth";
import { ScrollToTop } from "@/components/scroll-to-top";

// Font setup using Space Grotesk
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "African Centre For Career Mentorship | Professional Growth Platform",
  description: "Unlock your professional potential with expert mentorship, career resources, and skill development programs across Africa.",
  keywords: "career mentorship, professional development, african mentorship, scholarship quest, career mapping",
  authors: [{ name: "African Centre For Career Mentorship", url: "https://africanccm.com" }],
  creator: "African Centre For Career Mentorship",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://africanccm.com",
    site_name: "African Centre For Career Mentorship",
    title: "Empowering Careers, Inspiring Futures",
    description: "Connect with expert mentors and transform your career path with personalized guidance.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "African Centre For Career Mentorship",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "African Centre For Career Mentorship",
    description: "Unlock your professional potential with expert mentorship across Africa",
    images: ["/twitter-image.jpg"],
    creator: "@mentorglobally",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en" suppressHydrationWarning className={spaceGrotesk.variable}>
      <body
        className={cn(
          "min-h-screen antialiased font-sans bg-background",
          spaceGrotesk.className
        )}
      >
        <Providers session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <div className="relative flex min-h-svh flex-col bg-white dark:bg-gray-900">

                {/* Main layout */}
                <Header />
                
                <main className="flex-1 w-full relative z-10">
                  {children}
                </main>
                
                <Footer />
                
                {/* Scroll to top button */}
                <ScrollToTop />
                
                {/* Toast notifications */}
                <Toaster />
              </div>
            </QueryProvider>
          </ThemeProvider>
        </Providers>
      </body>
      <GoogleAnalytics gaId="G-ET371HQZ2X" />
    </html>
  );
}