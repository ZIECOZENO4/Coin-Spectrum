// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import ProvidersProgressBar from "./progressBarProvider";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/NewNavbar";
import { Providers } from "./tenstack-provider";
import Loader from "@/components/loader";
import AdminMessage from "./adminMessage";
import NotificationComponent from "./notifications";
import Loading from "./loading";
import Rate3 from "@/components/rate3";
import GoogleTranslate from "@/components/GoogleTranslate";
import SmartSuppScript from './smartsupp'
import StructuredData from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.coinspectrum.net'),
  title: {
    template: '%s | COIN SPECTRUM - World\'s Leading Trading Platform',
    default: 'COIN SPECTRUM - #1 Trusted Forex & Crypto Broker',
  },
  description: 'Join 2.5M+ traders on COIN SPECTRUM - The award-winning platform offering 300+ instruments, 0.0 pips spreads, and 25-40% annual returns. Regulated in 5 continents with 99% client satisfaction.',
  keywords: [
    'Forex trading', 'Cryptocurrency broker', 'Best investment platform', 
    'Trusted trading company', 'High return investments', 'Automated trading',
    'Social trading', 'Low spread broker', 'CFD trading', 'Wealth management'
  ],
  authors: [{ name: 'COIN SPECTRUM', url: 'https://www.coinspectrum.net' }],
  creator: 'COIN SPECTRUM',
  publisher: 'COIN SPECTRUM',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.coinspectrum.net',
    siteName: 'COIN SPECTRUM',
    title: 'COIN SPECTRUM - #1 Trusted Forex & Crypto Broker',
    description: 'Trade 300+ instruments with institutional-grade execution. Join 2.5M+ satisfied traders today.',
    images: [
      {
        url: 'https://www.coinspectrum.net/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'COIN SPECTRUM Trading Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@coinspectrum',
    creator: '@coinspectrum',
    title: 'COIN SPECTRUM - #1 Trusted Forex & Crypto Broker',
    description: 'Trade 300+ instruments with institutional-grade execution. Join 2.5M+ satisfied traders today.',
    images: ['https://www.coinspectrum.net/twitter-card.jpg'],
  },
  alternates: {
    canonical: 'https://www.coinspectrum.net',
    languages: {
      'en-US': 'https://www.coinspectrum.net/en-US',
      'es-ES': 'https://www.coinspectrum.net/es-ES',
      'fr-FR': 'https://www.coinspectrum.net/fr-FR',
      'de-DE': 'https://www.coinspectrum.net/de-DE',
      'zh-CN': 'https://www.coinspectrum.net/zh-CN',
    },
  },
  verification: {
    google: 'YOUR_GOOGLE_SEARCH_CONSOLE_KEY',
    yandex: 'YOUR_YANDEX_VERIFICATION_KEY',
    other: {
      'msvalidate.01': 'YOUR_BING_VERIFICATION_KEY',
    },
  },
  category: 'finance',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "COIN SPECTRUM",
    "description": "Leading Forex and Cryptocurrency Trading Platform",
    "url": "https://www.coinspectrum.net",
    "logo": "https://www.coinspectrum.net/logo.png",
    "sameAs": [
      "https://www.facebook.com/coinspectrum",
      "https://www.twitter.com/coinspectrum",
      "https://www.linkedin.com/company/coinspectrum"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "postalCode": "10001",
      "addressCountry": "US"
    },
    "openingHours": "Mo,Tu,We,Th,Fr 00:00-24:00",
    "telephone": "+1-555-123-4567"
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="trustpilot-one-time-domain-verification-id" content="4c3d47dd-da7d-480f-9a66-0630f0eb338c"/>
        <script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>
        <StructuredData data={jsonLd} />
        <meta name="google-site-verification" content="YOUR_GOOGLE_SEARCH_CONSOLE_KEY" />
        <meta name="ahrefs-site-verification" content="YOUR_AHREFS_VERIFICATION_KEY" />
      </head>
      <SmartSuppScript />
      <ClerkProvider
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded text-sm",
            input:
              "bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent rounded-lg text-sm",
            label: "text-gray-300 font-semibold text-sm",
          },
          variables: {
            colorPrimary: "#10b981",
            colorBackground: "#1f2937",
            colorText: "#f9fafb",
            borderRadius: "10px",
            fontSize: "14px",
          },
        }}
      >
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <ProvidersProgressBar>
                <Navbar />
                <AdminMessage />
                <NotificationComponent disabledPaths={[]} />
                <div className="bg-neutral-200 dark:bg-neutral-950 min-h-screen">
                  <Rate3 />
                  {children}
                </div>
                <div className="w-full align-middle items-center flex flex-row justify-center flex-wrap">
                  <GoogleTranslate />
                </div>
                <Toaster richColors />
              </ProvidersProgressBar>
            </Providers>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
