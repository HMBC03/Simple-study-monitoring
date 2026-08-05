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
  title: 'Bitácora de Estudio · Pomodoro, Repaso Espaciado y Curva del Olvido',
  description:
    'Bitácora de estudio con Pomodoro, repaso espaciado y curva del olvido. Registra tus asignaturas y temas, y descubre qué estudiar cada día para no olvidar.',
  metadataBase: new URL('https://www.hectorbeltran.com'),
  alternates: { canonical: '/bitacora' },
  applicationName: 'Bitácora de Estudio',
  authors: [{ name: 'Héctor Beltrán', url: 'https://www.hectorbeltran.com' }],
  keywords: ['estudio', 'pomodoro', 'repaso espaciado', 'curva del olvido', 'técnicas de estudio'],
  creator: 'Héctor Beltrán',
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  icons: { icon: '/logo.jpg', apple: '/logo.jpg' },
  openGraph: {
    siteName: 'Héctor Beltrán',
    title: 'Bitácora de Estudio · Pomodoro, Repaso Espaciado y Curva del Olvido',
    description:
      'Bitácora de estudio con Pomodoro, repaso espaciado y curva del olvido. Registra tus asignaturas y temas, y descubre qué estudiar cada día para no olvidar.',
    url: 'https://www.hectorbeltran.com/bitacora',
    type: 'website',
    locale: 'es_CO',
    images: [{ url: 'https://www.hectorbeltran.com/logo.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitácora de Estudio · Pomodoro, Repaso Espaciado y Curva del Olvido',
    description:
      'Bitácora de estudio con Pomodoro, repaso espaciado y curva del olvido. Registra tus asignaturas y temas, y descubre qué estudiar cada día para no olvidar.',
    images: ['https://www.hectorbeltran.com/logo.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#F3EEE2',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bitácora de Estudio',
  url: 'https://www.hectorbeltran.com/bitacora',
  description: 'Herramienta gratuita de estudio con Pomodoro, repaso espaciado y curva del olvido. Registra asignaturas y temas, y sabe qué repasar cada día.',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  inLanguage: 'es-CO',
  isAccessibleForFree: true,
  featureList: ['Temporizador Pomodoro', 'Repaso espaciado', 'Curva del olvido', 'Registro de asignaturas y temas', 'Modo foco'],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: { '@type': 'Person', name: 'Héctor Beltrán', url: 'https://www.hectorbeltran.com' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${karla.variable} ${plexMono.variable}`}>
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
