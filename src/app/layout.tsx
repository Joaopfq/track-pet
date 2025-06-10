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
import 'leaflet/dist/leaflet.css';

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
  description: "Let us help you track your pet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
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
        </body>
      </html>
    </ClerkProvider>
  );
}
