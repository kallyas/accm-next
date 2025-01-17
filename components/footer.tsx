import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-50/90 via-white/90 to-purple-50/90 dark:from-gray-900/90 dark:via-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm rounded-t-lg border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              About Us
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              African Centre For Career Mentorship is a sustainable centre of
              excellence for Career Mentorship and Human Capital Development in
              Africa.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Quick Links
            </h2>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/mentors"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Mentors
                </Link>
              </li>
              <li>
                <Link
                  href="/teams"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link
                  href="/career-map"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Career Assessment
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Contact Us
            </h2>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-muted-foreground">
                Plot 153, Kira Road, Kampala, Uganda
              </li>
              <li className="text-sm text-muted-foreground">
                Phone: +(477)-570-224-173(whatsapp)
              </li>
              <li className="text-sm text-muted-foreground">
                Email: admin@africanccm.com
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Subscribe to Our Newsletter
            </h2>
            <form className="mt-4 flex flex-col sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email"
                className="mr-2 mb-2 sm:mb-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700"
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white transition-all duration-300"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700/50 pt-8">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} African Centre For Career Mentorship.
              All rights reserved.
            </p>
            <div className="mt-4 flex space-x-6 sm:mt-0">
              <Link
                href="https://www.facebook.com/people/African-Centre-For-Career-Mentorship/61551044302562/?paipv=0&eav=AfbUD8Zh-9wRjw4tFs0kgv6fQfZ26xXoHwGhpM9WXMs1esn-eK9Fd1MYefU0wm9hsNg&_rdr"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </Link>
              <Link
                href="https://x.com/i/flow/login?redirect_after_login=%2Fmentorglobally"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </Link>
              <Link
                href="https://www.instagram.com/africancentre_careermentorship/"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/african-centre-for-career-mentorship-8a476228b/?originalSubdomain=ug"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
