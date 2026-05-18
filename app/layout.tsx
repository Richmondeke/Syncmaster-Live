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
  title: "SyncMaster",
  description: "Curated sync licensing marketplace for African composers and global producers.",
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
