import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans-base",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-base",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://janarthanan.dev"),
  title: { default: "Janarthanan S — Member of Technical Staff", template: "%s · Janarthanan S" },
  description: "Senior Software Engineer & Fullstack Developer building integrations, design systems, and AI tooling at SurveySparrow.",
  keywords: ["Janarthanan S", "Software Engineer", "Fullstack", "React", "Next.js", "Node.js", "SurveySparrow", "MTS", "Portfolio"],
  authors: [{ name: "Janarthanan S" }],
  openGraph: {
    title: "Janarthanan S — Member of Technical Staff",
    description: "I build the web at scale.",
    url: "https://janarthanan.dev",
    siteName: "Janarthanan S",
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Janarthanan S", description: "I build the web at scale." },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} dark`}>
      <body>
        <a href="#hero" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-3 focus:py-2 focus:bg-[var(--color-bg-elevated)] focus:rounded-md">Skip to content</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Janarthanan S",
              jobTitle: "Member of Technical Staff",
              worksFor: { "@type": "Organization", name: "SurveySparrow" },
              url: "https://janarthanan.dev",
              sameAs: [
                "https://www.linkedin.com/in/janarthanan-s-6731a5214/",
                "https://github.com/jana-1729",
                "https://medium.com/@janarthanans.in",
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
