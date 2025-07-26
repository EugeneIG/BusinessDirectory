export interface BusinessConfig {
  // Business Information
  business: {
    name: string
    tagline: string
    description: string
    logo: {
      icon: string
      text: string
      secondary: string
    }
    contact: {
      email: string
      phone: string
      address: string
    }
  }

  // Brand Colors
  colors: {
    primary: string
    secondary: string
    accent: string
    background: {
      primary: string
      secondary: string
      tertiary: string
    }
    text: {
      primary: string
      secondary: string
      muted: string
    }
    border: string
  }

  // Navigation
  navigation: {
    main: Array<{
      href: string
      label: string
    }>
    footer: Array<{
      href: string
      label: string
    }>
  }

  // Social Media
  social: Array<{
    name: string
    url: string
    icon: string
  }>

  // SEO & Meta
  seo: {
    title: string
    description: string
    keywords: string[]
    ogImage: string
    favicon: {
      icon: string
      appleTouchIcon: string
      shortcutIcon: string
    }
  }

  // Features & Settings
  features: {
    darkMode: boolean
    searchEnabled: boolean
        categoriesEnabled: boolean
        reviewsEnabled: boolean
  }
}

// Default BusinessDirectory Configuration
export const defaultConfig: BusinessConfig = {
  business: {
    name: "BusinessDirectory",
    tagline: "Discover Local Businesses",
    description: "Find the best local businesses, services, and experiences in your area. Connect with trusted providers and discover hidden gems.",
    logo: {
      icon: "MapPin",
      text: "Business",
      secondary: "Directory"
    },
    contact: {
      email: "cs@geoscraper.net",
      phone: "+1 (555) 123-4567",
      address: "123 Business Street, City, State 12345"
    }
  },

  colors: {
    primary: "#3B82F6", // blue-500
    secondary: "#8B5CF6", // purple-500
    accent: "#F59E0B", // amber-500
    background: {
      primary: "#FFFFFF",
      secondary: "#F9FAFB", // gray-50
      tertiary: "#F3F4F6" // gray-100
    },
    text: {
      primary: "#111827", // gray-900
      secondary: "#374151", // gray-700
      muted: "#6B7280" // gray-500
    },
    border: "#E5E7EB" // gray-200
  },

  navigation: {
    main: [
      { href: "/", label: "Home" },
      { href: "/businesses", label: "Browse" },
      { href: "/categories", label: "Categories" }
    ],
    footer: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/contact", label: "Contact" }
    ]
  },

  social: [
    {
      name: "Facebook",
      url: "#",
      icon: "Facebook"
    },
    {
      name: "Twitter",
      url: "#",
      icon: "Twitter"
    },
    {
      name: "Instagram",
      url: "#",
      icon: "Instagram"
    },
    {
      name: "LinkedIn",
      url: "#",
      icon: "Linkedin"
    }
  ],

  seo: {
    title: "BusinessDirectory - Discover Local Businesses",
    description: "Find the best local businesses, services, and experiences in your area. Connect with trusted providers and discover hidden gems.",
    keywords: ["local businesses", "business directory", "services", "reviews", "community"],
    ogImage: "/og-image.png",
    favicon: {
      icon: "favicon.ico",
      appleTouchIcon: "apple-touch-icon.png",
      shortcutIcon: "favicon.ico"
    }
  },

  features: {
    darkMode: true,
    searchEnabled: true,
    categoriesEnabled: true,
    reviewsEnabled: true
  }
}

// Export the current config (you can change this to use different configs)
export const config = defaultConfig 