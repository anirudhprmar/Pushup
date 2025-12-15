import { Heart } from "lucide-react";
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tight">PushUp</span>
            </Link>
            <p className="text-sm leading-6 text-gray-400 max-w-xs">
              Building the best version of yourself, one day at a time. Join the community of doers.
            </p>
          </div>

          {/* Links Section */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Product</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <FooterLink href="#" label="Features" />
                  <FooterLink href="#" label="Pricing" />
                  <FooterLink href="#" label="Testimonials" />
                  <FooterLink href="#" label="FAQ" />
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <FooterLink href="#" label="About" />
                  <FooterLink href="#" label="Blog" />
                  <FooterLink href="#" label="Careers" />
                  <FooterLink href="#" label="Contact" />
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <FooterLink href="#" label="Privacy" />
                  <FooterLink href="#" label="Terms" />
                  <FooterLink href="#" label="Cookie Policy" />
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs leading-5 text-gray-400">
            &copy; {currentYear} PushUp Inc. All rights reserved.
          </p>
          <p className="text-xs leading-5 text-gray-400 flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by <span className="text-white">Anirudh</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a href={href} className="text-gray-400 hover:text-white transition-colors">
      <span className="sr-only">{label}</span>
      {icon}
    </a>
  )
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link href={href} className="text-sm leading-6 text-gray-400 hover:text-white transition-colors">
        {label}
      </Link>
    </li>
  )
}
