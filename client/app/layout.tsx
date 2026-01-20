import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Numitz",
  description: "A platform for competitive mathematics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* MathJax v4 Configuration */}
        <script
          id="mathjax-config"
          dangerouslySetInnerHTML={{
            __html: `
              window.MathJax = {
                // LaTeX processing configuration
                tex: {
                  inlineMath: [['$', '$']],
                  displayMath: [['$$', '$$']],
                  processEscapes: true,
                  tags: 'ams',
                  tagSide: 'right',
                  tagIndent: '0.2em'
                },
                // Output rendering configuration
                output: {
                  font: 'mathjax-newcm'
                },
                // Initialization and startup configuration
                startup: {
                  pageReady() {
                    return MathJax.startup.defaultPageReady();
                  }
                }
              };
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* MathJax v4 CDN */}
        <Script
          src="https://cdn.jsdelivr.net/npm/mathjax@4/tex-chtml.js"
          strategy="afterInteractive"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
