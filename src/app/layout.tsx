import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Playmasters HQ | Nairobi's Premier Bowling Unit",
  description: "Strike like Playmasters. Official hub for performance analytics, league standings, and recruitment for Kenya's elite bowling squad.",
  metadataBase: new URL('https://playmasters.co.ke'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Playmasters HQ',
    description: "Nairobi's elite bowling performance hub.",
    url: 'https://playmasters.co.ke',
    siteName: 'Playmasters Kenya',
    images: [
      {
        url: '/logo-md.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playmasters HQ',
    description: "Strike like Playmasters. Nairobi's premier bowling team.",
    images: ['/logo-md.png'],
  },
};

// Root Layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${anton.variable} font-sans min-h-screen bg-navy-dark text-white selection:bg-strike selection:text-white`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
