import { Inter, Montserrat } from "next/font/google";
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

// Font setup for headings and body text
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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
    <html lang="en" suppressHydrationWarning className={`${montserrat.variable} ${inter.variable}`}>
      <body
        className={cn(
          "min-h-screen antialiased font-sans bg-background",
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
            <QueryProvider>
              <div className="relative flex min-h-svh flex-col">
                {/* Background decorative elements */}
                <div className="fixed inset-0 -z-10">
                  {/* Gradient background layer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white to-purple-50/70 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800" />
                  
                  {/* Grid pattern overlay */}
                  <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5 dark:opacity-3" />
                  
                  {/* Decorative shapes */}
                  <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-300/20 dark:bg-blue-700/10 rounded-full blur-3xl" />
                  <div className="absolute top-1/4 -right-20 w-60 h-60 bg-purple-300/20 dark:bg-purple-700/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-teal-300/20 dark:bg-teal-700/10 rounded-full blur-3xl" />
                </div>

                {/* Main layout */}
                <Header />
                
                <main className="flex-1 w-full mx-auto relative z-10">
                  <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                  </div>
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