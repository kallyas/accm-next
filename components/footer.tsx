import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-secondary rounded-t-lg">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-lg font-semibold text-primary">About Us</h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Pearl Mentor Hub is a sustainable centre of excellence for Career Mentorship and Human Capital Development in Africa.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary">Quick Links</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-muted-foreground hover:text-primary">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/mentors" className="text-sm text-muted-foreground hover:text-primary">
                  Mentors
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary">Contact Us</h2>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-muted-foreground">123 Mentor Street, Kampala, Uganda</li>
              <li className="text-sm text-muted-foreground">Phone: +256 123 456 789</li>
              <li className="text-sm text-muted-foreground">Email: info@pearlmentorhub.com</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary">Subscribe to Our Newsletter</h2>
            <form className="mt-4 flex flex-col sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email"
                className="mr-2 mb-2 sm:mb-0"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-300 pt-8">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Pearl Mentor Hub. All rights reserved.
            </p>
            <div className="mt-4 flex space-x-6 sm:mt-0">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

