import type { Metadata } from 'next';
import { BusinessProfile } from '@/types/menu';

export const VERIFIED_BUSINESS_INFO = {
  name: "King's Platter",
  location: "Sivakasi",
  district: "Virudhunagar",
  state: "Tamil Nadu",
  country: "India",
  address: "Housing Board, Srivilliputhur Main Rd, opposite to Abdul Kalam Library, Sivakasi, Tamil Nadu 626123",
  phone: "+91 89259 54227",
  mapUrl: "https://share.google/xkdrn68kXF2LODuKo",
  servesCuisine: ["Indian", "Biryani", "Mandi", "Chinese", "North Indian", "South Indian", "Italian", "Thai", "Chinese & Continental"],
};

export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://kingsplatter.com';

export function generateRestaurantMetadata(business?: Partial<BusinessProfile> | null): Metadata {
  const name = business?.name || VERIFIED_BUSINESS_INFO.name;
  const location = business?.location || VERIFIED_BUSINESS_INFO.location;
  const address = business?.address || VERIFIED_BUSINESS_INFO.address;
  const description = business?.description
    ? business.description
    : `Explore ${name} in ${location}, Tamil Nadu. Browse our digital menu featuring authentic biryani, mandi, starters, main course, Chinese & Continental dishes, seafood, and desserts.`;

  const titleText = `${name} | Restaurant in ${location}, Tamil Nadu`;

  return {
    title: titleText,
    description,
    keywords: [
      name,
      `Restaurant in ${location}`,
      `Biryani in ${location}`,
      `Mandi in ${location}`,
      `Best Restaurant ${location}`,
      `${location} Restaurant`,
      "Digital Menu",
      "QR Menu",
      "Virudhunagar Restaurant",
      "Tamil Nadu Dining",
    ],
    openGraph: {
      title: titleText,
      description,
      url: SITE_URL,
      siteName: name,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: business?.logoUrl || `${SITE_URL}/kings_platter_logo.jpg`,
          width: 800,
          height: 800,
          alt: `${name} Logo - Restaurant in ${location}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titleText,
      description,
      images: [business?.logoUrl || `${SITE_URL}/kings_platter_logo.jpg`],
    },
    alternates: {
      canonical: SITE_URL,
    },
  };
}

export function generateRestaurantJsonLd(business?: Partial<BusinessProfile> | null) {
  const name = business?.name || VERIFIED_BUSINESS_INFO.name;
  const addressStr = business?.address || VERIFIED_BUSINESS_INFO.address;
  const location = business?.location || VERIFIED_BUSINESS_INFO.location;
  const phone = business?.phone || VERIFIED_BUSINESS_INFO.phone;
  const mapUrl = business?.mapUrl || VERIFIED_BUSINESS_INFO.mapUrl;
  const logoUrl = business?.logoUrl ? (business.logoUrl.startsWith('http') ? business.logoUrl : `${SITE_URL}${business.logoUrl}`) : `${SITE_URL}/kings_platter_logo.jpg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${SITE_URL}/#restaurant`,
    name,
    url: SITE_URL,
    image: logoUrl,
    logo: logoUrl,
    telephone: phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: addressStr,
      addressLocality: location,
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
    hasMap: mapUrl,
    servesCuisine: VERIFIED_BUSINESS_INFO.servesCuisine,
    priceRange: '₹₹',
    openingHours: business?.openingHours || 'Mo-Su 11:30-23:00',
    sameAs: [
      business?.instagram,
      business?.facebook,
      business?.website,
      mapUrl,
    ].filter((url): url is string => Boolean(url && typeof url === 'string' && url.trim().length > 0)),
  };
}
