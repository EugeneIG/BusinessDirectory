"use client"

import { Mail, Phone } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { config } from "@/lib/config"
import { getIcon } from "@/lib/utils"

export function Footer() {
  const { business, navigation, social } = config
  const LogoIcon = getIcon(business.logo.icon)

  return (
    <footer className="bg-gray-50 border-t border-gray-200/50">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 group mb-4">
              <div className="relative">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <LogoIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-lg sm:text-xl font-bold text-gray-900">{business.logo.text}</span>
                <span className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">{business.logo.secondary}</span>
              </div>
            </Link>
            <p className="text-gray-600 mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
              {business.description}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm break-all">{business.contact.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{business.contact.phone}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 sm:col-span-1">
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h3>
            <nav className="flex flex-col space-y-1.5 sm:space-y-2">
              {navigation.main.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium relative group text-sm sm:text-base"
                >
                  {item.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="col-span-1 sm:col-span-1">
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Follow Us</h3>
            <div className="flex space-x-2 sm:space-x-3">
              {social.map((socialItem) => {
                const SocialIcon = getIcon(socialItem.icon)
                return (
                  <Button
                    key={socialItem.name}
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl hover:bg-gray-100 transition-all duration-300"
                    asChild
                  >
                    <Link href={socialItem.url} aria-label={socialItem.name}>
                      <SocialIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200/50 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-gray-600 text-xs sm:text-sm text-center sm:text-left">
            © 2024 {business.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
            {navigation.footer.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
} 