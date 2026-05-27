import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { cn } from "@/lib/cn";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rakit — Build at the speed of thought",
  description:
    "Rakit is a production-grade Next.js boilerplate engineered for teams who ship.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(GeistSans.variable, GeistMono.variable)}
    >
      <body className="font-sans antialiased bg-background text-foreground grain selection:bg-black/20">
        {children}
      </body>
    </html>
  );
}
