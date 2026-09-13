import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { RtlProvider } from "@/components/providers/RtlProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lighthouse Compare — PageSpeed Insights",
  description:
    "Compare two websites side-by-side with Google PageSpeed Insights API. Full Lighthouse reports with mobile and desktop analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <RtlProvider>{children}</RtlProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
