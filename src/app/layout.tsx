import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { Poppins } from "next/font/google";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";
import StoreProvider from '../app/StoreProvider'
import Pwa from "@/components/PwaRegister";
import Head from 'next/head';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Track Pet",
  description: "Track Pet is a web application created to help pet owners to find their lost pets and to help people to find lost pets.",
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/paw-512-white.png',
    apple: '/icons/paw-512-white.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#1976d2" />
          <link rel="apple-touch-icon" href="/icons/paw-192.png" />
        </head>
        <body
          className={`${poppins.variable} ${roboto.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <StoreProvider>
              <div className="min-h-screen">
                <Navbar />
                <main className="py-8">
                  <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="hidden lg:block lg:col-span-3">
                        <Sidebar />
                      </div>
                      <div className="lg:col-span-9">{children}</div>
                    </div>
                  </div>
                </main>
              </div>
              <Toaster />
            </StoreProvider>
          </ThemeProvider>
          <Pwa />
        </body>
      </html>
    </ClerkProvider>
  );
}