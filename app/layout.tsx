import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import { FirebaseProvider } from "@/components/providers/FirebaseProvider";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SyncMaster — Get your songs synced in TV, Games, Movies and Ads",
  description: "Join thousands of artistes using Syncmaster to discover and track sync opportunities. Syncmaster provides artistes and labels the tools they need to manage their sync operations.",
  openGraph: {
    title: "SyncMaster — Get your songs synced in TV, Games, Movies and Ads",
    description: "Join thousands of artistes using Syncmaster to discover and track sync opportunities. Syncmaster provides artistes and labels the tools they need to manage their sync operations.",
    url: "https://syncmaster-live.vercel.app",
    siteName: "SyncMaster",
    images: [
      {
        url: "/syncscreen.png",
        width: 1200,
        height: 630,
        alt: "SyncMaster — Get your songs synced in TV, Games, Movies and Ads",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SyncMaster — Get your songs synced in TV, Games, Movies and Ads",
    description: "Join thousands of artistes using Syncmaster to discover and track sync opportunities. Syncmaster provides artistes and labels the tools they need to manage their sync operations.",
    images: ["/syncscreen.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`h-full antialiased ${dmSans.variable}`}>
      <body className="min-h-full flex flex-col font-sans">
        <ToastProvider>
          <FirebaseProvider>{children}</FirebaseProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
