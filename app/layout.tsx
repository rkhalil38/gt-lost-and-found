import { GeistSans } from "geist/font/sans";
import "./globals.css";
import UnivHeader from "@/components/UnivHeader";
import Footer from "@/components/Footer";
import { Analytics } from '@vercel/analytics/react';

const defaultUrl = `https://gt-lost-and-found.org`;

export const metadata = {
  metadataBase: new URL(defaultUrl),
  author: "Romulus Khalil",
  title: "GT Lost and Found",
  description: "The best way to find lost items at Georgia Tech. Place a pin on the map to indicate where you found a lost item, or search for lost items to see if someone has found your lost item.",
  keywords: [
    "lost items georgia tech",
    "lost and found georgia tech",
    "lost items in georgia tech",
    "lost and found gt",
    "GT lost and found",
    "items lost at georgia tech",
  ],
  openGraph: {
    title: "GT Lost and Found",
    description: "The best way to find lost items at Georgia Tech.",
    siteName: "GT Lost and Found",
    images: [
      {
        url: "/Buzz.png",
        width: 1200,
        height: 630,
        alt: "GT Lost and Found",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiKey = process.env.GOOGLE_MAPS_KEY ? process.env.GOOGLE_MAPS_KEY : "";

  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-mainTheme text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <UnivHeader apiKey={apiKey} />
          {children}
          <Analytics />
          <Footer />
        </main>
      </body>
    </html>
  );
}
