import type { Metadata } from 'next';
import '../index.css';

export const metadata: Metadata = {
  title: "KING'S PLATTER — QR Digital Restaurant Menu",
  description: "Experience royal dining at King's Platter Restaurant & Cafe. Browse our premium digital menu, appetizers, chef specials, seafood, and desserts.",
  openGraph: {
    title: "KING'S PLATTER — QR Digital Restaurant Menu",
    description: "Great Food | Royal Experience at King's Platter Restaurant & Cafe.",
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0D0D10] text-[#E8E8ED] antialiased">
        {children}
      </body>
    </html>
  );
}
