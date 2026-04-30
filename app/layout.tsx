import type { Metadata } from "next";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

// Use system fonts to avoid Google Fonts download issues
// Font stacks defined in tailwind.config.ts

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
