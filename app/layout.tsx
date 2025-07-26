import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { config } from "@/lib/config"

const inter = Inter({ subsets: ["latin"] })

// Generate dynamic URLs and details from config
const getDomainFromConfig = () => {
  // Extract domain from business email or generate from business name
  const emailDomain = config.business.contact.email.split('@')[1]
  return emailDomain || `${config.business.name.toLowerCase().replace(/\s+/g, '')}.com`
}

const getSocialHandles = () => {
  const handles: { [key: string]: string } = {}
  config.social.forEach(social => {
    const platform = social.name.toLowerCase()
    if (platform === 'twitter' || platform === 'x') {
      handles.twitter = `@${config.business.name.toLowerCase().replace(/\s+/g, '')}`
    } else if (platform === 'facebook') {
      handles.facebook = config.business.name.toLowerCase().replace(/\s+/g, '')
    } else if (platform === 'instagram') {
      handles.instagram = config.business.name.toLowerCase().replace(/\s+/g, '')
    } else if (platform === 'linkedin') {
      handles.linkedin = config.business.name.toLowerCase().replace(/\s+/g, '')
    }
  })
  return handles
}

const domain = getDomainFromConfig()
const socialHandles = getSocialHandles()
const baseUrl = `https://${domain}`

export const metadata: Metadata = {
  title: {
    default: config.seo.title,
    template: `%s | ${config.business.name}`
  },
  description: config.seo.description,
  keywords: config.seo.keywords,
  authors: [{ name: config.business.name }],
  creator: config.business.name,
  publisher: config.business.name,
  generator: 'bornby.me',
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: config.seo.favicon.icon, sizes: 'any' },
      { url: config.seo.favicon.shortcutIcon, sizes: 'any' }
    ],
    apple: config.seo.favicon.appleTouchIcon,
    shortcut: config.seo.favicon.shortcutIcon,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: config.business.name,
    title: config.seo.title,
    description: config.seo.description,
    images: [
      {
        url: config.seo.ogImage,
        width: 1200,
        height: 630,
        alt: config.business.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: config.seo.title,
    description: config.seo.description,
    images: [config.seo.ogImage],
    creator: socialHandles.twitter || `@${config.business.name.toLowerCase().replace(/\s+/g, '')}`,
    site: socialHandles.twitter || `@${config.business.name.toLowerCase().replace(/\s+/g, '')}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: `${config.business.name.toLowerCase().replace(/\s+/g, '')}-verification`,
    yandex: `${config.business.name.toLowerCase().replace(/\s+/g, '')}-yandex`,
    yahoo: `${config.business.name.toLowerCase().replace(/\s+/g, '')}-yahoo`,
  },
  category: 'business',
  classification: 'business directory',
  other: {
    'theme-color': config.colors.primary,
    'msapplication-TileColor': config.colors.primary,
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': config.business.name,
    'application-name': config.business.name,
    'format-detection': 'telephone=no',
    'contact-info': config.business.contact.email,
    'business-phone': config.business.contact.phone,
    'business-address': config.business.contact.address,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
