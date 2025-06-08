import Link from "next/link"
import { Shield, Twitter, Github, Linkedin } from "lucide-react"
import { Separator } from "../../components/ui/seperator"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
          {/* Brand Column */}
          <div className="flex flex-col space-y-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gradient-to-br from-gray-800 to-gray-900">
                <Shield className="absolute inset-0 h-full w-full p-2 text-gray-100" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900">SecureURL</span>
            </Link>

            <p className="max-w-md text-base leading-relaxed text-gray-600">
              Advanced URL security scanning and phishing detection to keep your organization safe from online threats.
            </p>

            <div className="flex items-center space-x-4 pt-4">
              <Link
                href="#"
                className="rounded-full bg-gray-200 p-3 text-gray-600 transition-all duration-200 hover:bg-gray-800 hover:text-white"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="rounded-full bg-gray-200 p-3 text-gray-600 transition-all duration-200 hover:bg-gray-800 hover:text-white"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="#"
                className="rounded-full bg-gray-200 p-3 text-gray-600 transition-all duration-200 hover:bg-gray-800 hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Resources Column */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-lg font-bold tracking-wide text-gray-900">Resources</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col space-y-3">
                <Link href="/docs" className="text-base text-gray-600 transition-colors hover:text-gray-900">
                  Documentation
                </Link>
                <Link href="/guides" className="text-base text-gray-600 transition-colors hover:text-gray-900">
                  Guides
                </Link>
                <Link href="/blog" className="text-base text-gray-600 transition-colors hover:text-gray-900">
                  Blog
                </Link>
              </div>
              <div className="flex flex-col space-y-3">
                <Link href="/support" className="text-base text-gray-600 transition-colors hover:text-gray-900">
                  Support
                </Link>
                <Link href="/status" className="text-base text-gray-600 transition-colors hover:text-gray-900">
                  Status
                </Link>
                <Link href="/contact" className="text-base text-gray-600 transition-colors hover:text-gray-900">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Bottom Footer Row */}
        <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0">
          <p className="text-sm text-gray-500">&copy; {currentYear} SecureURL. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="text-sm text-gray-500 transition-colors hover:text-gray-900">
              Privacy Policy
            </Link>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            <Link href="/terms" className="text-sm text-gray-500 transition-colors hover:text-gray-900">
              Terms of Service
            </Link>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            <Link href="/cookies" className="text-sm text-gray-500 transition-colors hover:text-gray-900">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
