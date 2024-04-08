import { GeistSans } from "geist/font/sans";
import "./globals.css";
import UnivHeader from "@/components/UnivHeader";
import Footer from "@/components/Footer";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "GT Lost and Found",
  description: "The best way to find lost items at Georgia Tech.",
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
          <Footer />
        </main>
      </body>
    </html>
  );
}
