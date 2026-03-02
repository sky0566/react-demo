import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { PageTracker } from "@/components/PageTracker";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Gallop Lift Parts - Professional Elevator & Escalator Parts Supplier",
    template: "%s | Gallop Lift Parts",
  },
  description:
    "Suzhou Gallop Technology Co., Ltd. - Professional One-Stop elevator and escalator solution plan supplier. Quality parts for Selcom, Fermator, Kone, Sword, Canny, Mitsubishi and more.",
  keywords: [
    "elevator parts",
    "escalator parts",
    "lift parts",
    "Selcom",
    "Fermator",
    "Kone",
    "Sword",
    "Canny",
    "Mitsubishi",
    "elevator door",
    "escalator step",
    "guide rails",
    "light curtain",
    "elevator supplier",
  ],
  authors: [{ name: "Suzhou Gallop Technology Co., Ltd." }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.gallopliftparts.com",
    siteName: "Gallop Lift Parts",
    title: "Gallop Lift Parts - Professional Elevator & Escalator Parts Supplier",
    description:
      "Professional One-Stop elevator and escalator solution plan supplier",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallop Lift Parts",
    description:
      "Professional One-Stop elevator and escalator solution plan supplier",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.gallopliftparts.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${poppins.variable} antialiased`}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <PageTracker />
        {children}
      </body>
    </html>
  );
}
