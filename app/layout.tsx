import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import { FirebaseProvider } from "@/components/providers/FirebaseProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SyncMaster — African Composers. Global Briefs.",
  description: "SyncMaster connects vetted African composers with briefs from production houses worldwide. Human curation. Rights clarity. 3–5 curated matches — not 500 unvetted submissions.",
  openGraph: {
    title: "SyncMaster — African Composers. Global Briefs.",
    description: "SyncMaster connects vetted African composers with briefs from production houses worldwide. Human curation. Rights clarity. 3–5 curated matches — not 500 unvetted submissions.",
    url: "https://syncmaster.live",
    siteName: "SyncMaster",
    images: [
      {
        url: "/syncscreen.png",
        width: 1200,
        height: 630,
        alt: "SyncMaster — African Composers. Global Briefs.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SyncMaster — African Composers. Global Briefs.",
    description: "SyncMaster connects vetted African composers with briefs from production houses worldwide. Human curation. Rights clarity. 3–5 curated matches — not 500 unvetted submissions.",
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ToastProvider>
            <FirebaseProvider>{children}</FirebaseProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
