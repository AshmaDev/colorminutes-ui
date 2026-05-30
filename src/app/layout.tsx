import type { Metadata } from "next";
import { Geist, IBM_Plex_Mono } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "ColorMinutes",
  description:
    "Turn HOA board meetings into clear, color-coded minutes with motions, votes, and action items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${ibmPlexMono.variable} min-h-screen antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
