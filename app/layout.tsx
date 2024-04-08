import { GeistSans } from "geist/font/sans";
import "./globals.css";
import UnivHeader from "@/components/UnivHeader";
import Footer from "@/components/Footer";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
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
