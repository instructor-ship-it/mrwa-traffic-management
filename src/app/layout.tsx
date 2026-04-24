import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "MRWA EQSafe Banner Alert Library",
  description: "Library and catalogue of Main Roads Western Australia EQSafe Banner Alert documents",
  keywords: ["MRWA", "EQSafe", "Banner Alert", "Main Roads Western Australia", "safety"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased bg-background text-foreground"
        style={{ fontFamily: "'Geist', system-ui, -apple-system, sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
