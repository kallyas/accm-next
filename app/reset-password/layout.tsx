import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export const metadata: Metadata = {
  title: "Password Recovery - African Centre For Career Mentorship",
  description: "Reset your password for the African Centre For Career Mentorship platform",
};

export default async function PasswordRecoveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }
  
  return (
    <div className="min-h-svh relative flex">
      {/* Left side - Authentication form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 lg:p-16 relative z-10">
        {/* Logo */}
        <div className="w-full max-w-md mb-6 flex justify-center">
          <Link href="/" className="inline-block">
            <Image 
              src="/logo.png" 
              alt="African Centre For Career Mentorship" 
              width={180} 
              height={60} 
              className="h-10 w-auto"
            />
          </Link>
        </div>
        
        {/* Auth content */}
        <div>
          {children}
        </div>
        
        {/* Footer */}
        <div className="w-full max-w-md mt-8 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} African Centre For Career Mentorship. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
      
      {/* Right side - Decorative background (only on larger screens) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Background overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-teal-500/90 z-10"></div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10 mix-blend-overlay z-20"></div>
        
        {/* Background image */}
        <div className="absolute inset-0">
          <Image 
            src="/accm/IMG_4710.JPG" 
            alt="Career mentorship" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12 z-30">
          <div className="max-w-lg text-center">
            <h1 className="text-3xl font-bold mb-6">Account Security</h1>
            <p className="text-lg mb-8">
              We're committed to keeping your account secure. A strong password is an important step in protecting your account and personal information.
            </p>
            
            {/* Security tips */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Password Security Tips</h2>
              <ul className="space-y-3 text-left">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span>Use a unique password for each of your important accounts</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span>Use a mix of letters, numbers, and symbols</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span>Avoid using easily guessed information like birthdays</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span>Consider using a password manager for secure storage</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background for mobile (when right panel is hidden) */}
      <div className="fixed inset-0 -z-10 lg:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white to-purple-50/70 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5"></div>
        
        {/* Decorative shapes */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-300/10 dark:bg-blue-700/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-60 h-60 bg-teal-300/10 dark:bg-teal-700/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-purple-300/10 dark:bg-purple-700/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}