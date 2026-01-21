import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

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
          tex: {
            // Inline math: support \( ... \) and $ ... $
            inlineMath: [['\\\\(', '\\\\)'], ['$', '$']],
            // Display math: support \[ ... \] and $$ ... $$
            displayMath: [['\\\\[', '\\\\]'], ['$$', '$$']],
            processEscapes: true,
            tags: 'ams',             // support \tag{} numbering
            tagSide: 'right',
            tagIndent: '0.2em'
          },
          options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'], 
          },
          chtml: {
            // font variant
            scale: 1,
            mtextInheritFont: true
          },
          startup: {
            pageReady() {
              // ensures MathJax finishes typesetting before Next.js hydration
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
          <Toaster />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
