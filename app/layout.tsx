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
  title: "CoinSpectrum.com",
  description: "Your best trading broker and investment platform ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider
        appearance={{
          elements: {
            // Styling primary buttons with a green color and dark mode aesthetics
            formButtonPrimary:
              "bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded text-sm",
            // Styling input fields for dark mode with a focus state in green
            input:
              "bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent rounded-lg text-sm",
            // Styling labels for dark mode with a lighter text color for contrast
            label: "text-gray-300 font-semibold text-sm",

            // Additional elements can be styled here to match the dark mode theme
          },
          // Defining global variables for dark mode and green as the primary color
          variables: {
            colorPrimary: "#10b981", // Using Tailwind's green-500 as the primary color
            colorBackground: "#1f2937", // Using Tailwind's gray-800 for background color in dark mode
            colorText: "#f9fafb", // Using a light color for text in dark mode for contrast
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

                {/* {children} */}
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
                  <div className=" w-full align-middle items-center flex flex-row justify-center flex-wrap">
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
