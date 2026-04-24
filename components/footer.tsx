import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  const primaryLinks = [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Mentors", href: "/mentors" },
    { label: "Our Team", href: "/teams" },
    { label: "CareerMap", href: "/career-map" },
  ];

  const resourceLinks = [
    { label: "Scholarship Quest", href: "/scholarship-quest" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ];

  const socialLinks = [
    {
      label: "Facebook",
      href: "https://www.facebook.com/people/African-Centre-For-Career-Mentorship/61551044302562/?paipv=0&eav=AfbUD8Zh-9wRjw4tFs0kgv6fQfZ26xXoHwGhpM9WXMs1esn-eK9Fd1MYefU0wm9hsNg&_rdr",
      icon: Facebook,
    },
    {
      label: "Twitter",
      href: "https://x.com/i/flow/login?redirect_after_login=%2Fmentorglobally",
      icon: Twitter,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/africancentre_careermentorship/",
      icon: Instagram,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/african-centre-for-career-mentorship-8a476228b/?originalSubdomain=ug",
      icon: Linkedin,
    },
  ];

  return (
    <footer className="relative border-t border-[#1A1B4B]/20 bg-[#f1eee8] text-[#1A1B4B]   ">
      <div className="mx-auto w-full max-w-[88rem] px-5 py-12 sm:px-7 lg:px-10">
        <div className="grid gap-10 border-b border-[#1A1B4B]/20 pb-10 md:grid-cols-[1.2fr_0.8fr] ">
          <div className="max-w-2xl space-y-5">
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.28em] text-[#1A1B4B]/70 ">
              African Centre For Career Mentorship
            </p>
            <h2 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl">
              Career clarity for a changing African job market.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-[#1A1B4B] ">
              A sustainable centre of excellence for career mentorship and human
              capital development across the continent.
            </p>
          </div>

          <div className="space-y-4 self-end border-l border-[#1A1B4B]/20 pl-6 ">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1B4B]/70 ">
              Reach us
            </p>
            <p className="text-sm leading-7 text-[#1A1B4B] ">
              Conrad Plaza, 7th Floor, above ISBAT University (City Campus),
              Next to Andro Smart Options LTD
            </p>
            <p className="text-sm leading-6 text-[#1A1B4B] ">
              +(477)-570-224-173 (WhatsApp)
            </p>
            <Link
              href="mailto:admin@africanccm.com"
              className="inline-block text-sm font-semibold text-[#1A1B4B] underline decoration-[#1A1B4B]/40 underline-offset-4 transition-colors hover:text-[#1A1B4B]/70   "
            >
              admin@africanccm.com
            </Link>
          </div>
        </div>

        <div className="grid gap-8 py-10 md:grid-cols-[0.65fr_1fr]">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1B4B]/70 ">
              Navigate
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#1A1B4B] transition-colors hover:text-[#1A1B4B]  "
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-l border-[#1A1B4B]/20 pl-0 md:pl-6 ">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1B4B]/70 ">
              Policy & resources
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {resourceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#1A1B4B] transition-colors hover:text-[#1A1B4B]  "
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#1A1B4B]/20 pt-6 sm:flex-row sm:items-center sm:justify-between ">
          <p className="text-xs text-[#1A1B4B]/70 ">
            © {new Date().getFullYear()} African Centre For Career Mentorship.
            All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center border border-[#1A1B4B]/20 text-[#1A1B4B] transition-colors hover:bg-[#1A1B4B]/10 hover:text-[#1A1B4B]    "
                >
                  <span className="sr-only">{item.label}</span>
                  <Icon className="h-4 w-4" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
