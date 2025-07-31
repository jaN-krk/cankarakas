import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Vizodex - Dijital Menü Sistemi',
    template: '%s | Vizodex',
  },
  description: 'Modern restoran ve kafeler için QR kod tabanlı dijital menü sistemi. Kolay yönetim, mobil uyumlu tasarım.',
  keywords: ['dijital menü', 'QR menü', 'restoran', 'kafe', 'menü sistemi', 'vizodex'],
  authors: [{ name: 'Vizodex' }],
  creator: 'Vizodex',
  publisher: 'Vizodex',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vizodex.com'),
  alternates: {
    canonical: '/',
    languages: {
      'tr-TR': '/tr',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://vizodex.com',
    title: 'Vizodex - Dijital Menü Sistemi',
    description: 'Modern restoran ve kafeler için QR kod tabanlı dijital menü sistemi',
    siteName: 'Vizodex',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Vizodex Dijital Menü Sistemi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vizodex - Dijital Menü Sistemi',
    description: 'Modern restoran ve kafeler için QR kod tabanlı dijital menü sistemi',
    images: ['/images/twitter-image.jpg'],
    creator: '@vizodex',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Vizodex" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
            {children}
          </div>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
                border: '1px solid var(--toast-border)',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

