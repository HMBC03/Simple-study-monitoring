import type { Metadata, Viewport } from 'next';
import { Fraunces, IBM_Plex_Mono, Karla } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
});

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-karla',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Study Log · Pomodoro, Spaced Repetition and the Forgetting Curve',
  description:
    'A study tracker with Pomodoro, spaced repetition and the forgetting curve. Log your subjects and topics, and find out what to review each day so you never forget.',
  metadataBase: new URL('https://www.hectorbeltran.com'),
  alternates: { canonical: '/bitacora' },
  applicationName: 'Study Log',
  authors: [{ name: 'Héctor Beltrán', url: 'https://www.hectorbeltran.com' }],
  keywords: ['study', 'pomodoro', 'spaced repetition', 'forgetting curve', 'study techniques'],
  creator: 'Héctor Beltrán',
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  icons: { icon: '/logo.jpg', apple: '/logo.jpg' },
  openGraph: {
    siteName: 'Héctor Beltrán',
    title: 'Study Log · Pomodoro, Spaced Repetition and the Forgetting Curve',
    description:
      'A study tracker with Pomodoro, spaced repetition and the forgetting curve. Log your subjects and topics, and find out what to review each day so you never forget.',
    url: 'https://www.hectorbeltran.com/bitacora',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://www.hectorbeltran.com/logo.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study Log · Pomodoro, Spaced Repetition and the Forgetting Curve',
    description:
      'A study tracker with Pomodoro, spaced repetition and the forgetting curve. Log your subjects and topics, and find out what to review each day so you never forget.',
    images: ['https://www.hectorbeltran.com/logo.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#F3EEE2',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Study Log',
  url: 'https://www.hectorbeltran.com/bitacora',
  description: 'Free study tool with Pomodoro, spaced repetition and the forgetting curve. Track subjects and topics, and know what to review every day.',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  inLanguage: 'en',
  isAccessibleForFree: true,
  featureList: ['Pomodoro timer', 'Spaced repetition', 'Forgetting curve', 'Subject and topic tracking', 'Focus mode'],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: { '@type': 'Person', name: 'Héctor Beltrán', url: 'https://www.hectorbeltran.com' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${karla.variable} ${plexMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
