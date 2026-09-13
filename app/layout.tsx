import { Inter } from "next/font/google";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { RtlProvider } from "@/components/providers/RtlProvider";
import {
  webApplicationJsonLd,
  webSiteJsonLd,
} from "@/lib/seo/json-ld";
import { rootMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={siteConfig.language} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <JsonLd data={[webSiteJsonLd(), webApplicationJsonLd()]} />
        <ThemeProvider>
          <RtlProvider>
            {children}
            <CookieConsentBanner />
          </RtlProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
