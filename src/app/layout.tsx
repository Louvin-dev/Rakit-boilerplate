import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { cn } from "@/lib/cn";
import { VisualBridge } from "@/components/_rakit/visual-bridge";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rakit app",
  description: "Built with Rakit.",
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
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {/* Dev-only bridge for Rakit's "Edit visual" feature.
            Self-gates by NODE_ENV so prod builds drop it. */}
        <VisualBridge />
      </body>
    </html>
  );
}
