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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.coinspectrum.net'),
  title: {
    template: '%s | COIN SPECTRUM',
    default: 'COIN SPECTRUM - Your only trusted investment and broker platform.',
  },
  description: 'COIN SPECTRUM is an investment and trading platform for all users all over the world',
  keywords: ['Investment', 'Trading', 'Referral'],
  authors: [{ name: 'COIN SPECTRUM' }],
  creator: 'COIN SPECTRUM',
  publisher: 'COIN SPECTRUM',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.coinspectrum.net',
    siteName: 'COIN SPECTRUM',
    title:  'COIN SPECTRUM - Your only trusted investment and broker platform.',
    description:  'COIN SPECTRUM is an investment and trading platform for all users all over the world',
    images: [
      {
        url: 'https://www.coinspectrum.net/seo.png',
        width: 1200,
        height: 630,
        alt: 'Site Preview Image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'COIN SPECTRUM',
    description:  'COIN SPECTRUM is an investment and trading platform for all users all over the world',
    images: ['https://www.coinspectrum.net/seo.png'],
    creator: '@yourtwitter',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://www.coinspectrum.net',
    languages: {
      'en-US': 'https://www.coinspectrum.net/en-US',
      'es-ES': 'https://www.coinspectrum.net/es-ES',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <script src="//code.tidio.co/hry7v33ulf36eo4ksprdkbfvoaw568wi.js" async></script>
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
                <ClerkLoading>
                  <Loader className="flex items-center justify-center w-screen h-screen" />
                </ClerkLoading>
                <ClerkLoaded>
                  <AdminMessage />
                  <NotificationComponent disabledPaths={[]} />
                  <div className="bg-neutral-200 dark:bg-neutral-950 min-h-screen">
                    <Rate3 />
                    {children}
                  </div>
                  <div className="w-full align-middle items-center flex flex-row justify-center flex-wrap">
                    <GoogleTranslate />
                  </div>
                </ClerkLoaded>
                <Toaster richColors />
              </ProvidersProgressBar>
            </Providers>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
