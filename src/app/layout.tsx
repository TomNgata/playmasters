import type { Metadata } from "next";
import { Inter, Anton, Teko } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-body',
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: '--font-wordmark',
});

const teko = Teko({
  subsets: ["latin"],
  variable: '--font-ui',
});

export const metadata: Metadata = {
  title: "Playmasters HQ",
  description: "Strike like Playmasters. Nairobi's premier bowling team.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${anton.variable} ${teko.variable} font-sans min-h-screen bg-navy-dark text-white selection:bg-strike selection:text-white`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
