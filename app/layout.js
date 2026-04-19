import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from "@/components/ui/sonner";
import Footer from "./dashboard/_components/Footer";
import Header from "./dashboard/_components/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  fallback: ['system-ui', 'arial', 'sans-serif']
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  fallback: ['Courier New', 'monospace']
});

export const metadata = {
  title: {
    default: 'IntervX - AI-Powered Interview Preparation',
    template: '%s | IntervX'
  },
  description: 'Elevate your interview skills with AI-powered mock interviews. Get personalized coaching, real-time feedback, and boost your confidence.',
  keywords: ['AI interview preparation', 'mock interviews', 'interview coaching', 'career development'],
  authors: [{ name: 'IntervX Team' }],
  creator: 'IntervX',
  publisher: 'IntervX',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="antialiased min-h-screen flex flex-col bg-gray-950 text-gray-100 font-sans">
          <Header />
          <Toaster />
          <main id="main-content" className="flex-grow pt-16 sm:pt-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}