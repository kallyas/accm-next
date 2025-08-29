import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              About Us
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              African Centre For Career Mentorship is a sustainable centre of
              excellence for Career Mentorship and Human Capital Development in
              Africa.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Links
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
                  CareerMap
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              More Links
            </h2>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                href="/scholarship-quest"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Scholarship Quest
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
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