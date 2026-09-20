# King's Platter Digital Menu — Firebase Setup & Security Guide

## Overview

King's Platter uses Firebase for Database (Firestore), Authentication, and File Storage.

---

## 1. Firebase Firestore Data Model

### Admins Collection: `admins/{uid}`
```json
{
  "uid": "string",
  "email": "string",
  "name": "string",
  "role": "Super Admin | Admin",
  "createdAt": "ISO-Date",
  "updatedAt": "ISO-Date"
}
```

### Business Profile Collection: `businessProfile/{businessId}`
```json
{
  "name": "KING'S PLATTER",
  "subName": "RESTAURANT",
  "tagline": "Great Food | Royal Experience",
  "location": "Tirunelveli",
  "address": "No. 42, Royal Avenue, South Bypass Road...",
  "phone": "+91 98765 43210",
  "email": "info@kingsplatter.com",
  "whatsapp": "+919876543210",
  "mapUrl": "https://maps.google.com/...",
  "openingHours": "11:30 AM - 11:00 PM",
  "currency": "₹",
  "instagram": "https://instagram.com/kingsplatter",
  "facebook": "https://facebook.com/kingsplatter",
  "website": "https://kingsplatter.com",
  "logoUrl": "/kings_platter_logo.jpg",
  "googleReviewUrl": "https://search.google.com/..."
}
```

### Categories Collection: `categories/{categoryId}`
```json
{
  "name": "Soup",
  "slug": "soup",
  "iconName": "Soup",
  "imageUrl": "https://images.unsplash.com/...",
  "description": "Classic comfort in a bowl...",
  "displayOrder": 1,
  "isActive": true
}
```

### Food Items Collection: `foodItems/{foodItemId}`
```json
{
  "categoryId": "cat-seafood",
  "categoryName": "King's Special Seafood",
  "name": "Grilled Prawns",
  "description": "Juicy prawns grilled to perfection...",
  "price": 499,
  "discountPercentage": 10,
  "finalPrice": 449,
  "imageUrl": "https://images.unsplash.com/...",
  "isAvailable": true,
  "dietary": "non-veg",
  "isPopular": true,
  "isChefSpecial": true,
  "displayOrder": 1
}
```

---

## 2. Deploying Firestore & Storage Rules

Deploy security rules via Firebase CLI:
```bash
firebase deploy --only firestore:rules,storage
```

---

## 3. Environment Variable Security

Ensure server secrets (`FIREBASE_PRIVATE_KEY`, `FIREBASE_SERVICE_ACCOUNT_KEY`) are set ONLY in deployment environment settings (Vercel / Cloudflare / `.env.local`) and never committed to source control.
