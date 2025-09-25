import { Inter } from "next/font/google";
import "./globals.css";
import ClientRoot from "@/components/ClientRoot";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata = {
  title: 'Avangard Bank',
  description: 'Avangard Bank web application',
};

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <ClientRoot>
      {children}
    </ClientRoot>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Avangard Bank" />
        <meta name="theme-color" content="#fdeb0a" />
        <meta name="msapplication-TileColor" content="#fdeb0a" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-century antialiased`}>
        <LayoutContent>{children}</LayoutContent>
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-yellow-500 text-black px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-yellow-600"
        >
          Перейти до основного вмісту
        </a>
      </body>
    </html>
  );
}
