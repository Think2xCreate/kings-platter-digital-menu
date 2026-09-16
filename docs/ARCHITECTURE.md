# King's Platter Digital Menu — System Architecture Documentation

## Architecture Overview

The King's Platter QR Digital Menu Application is built on **Next.js App Router** with **Firebase (Cloud Firestore, Authentication, Storage)**, designed with enterprise separation of concerns, zero-trust backend authorization, and full UI/UX preservation.

```
+-------------------------------------------------------------------------+
|                              CUSTOMER FLOW                              |
|   Public QR Code -> Next.js App Router (SSR/ISR) -> Fast Menu Render   |
+-------------------------------------------------------------------------+

+-------------------------------------------------------------------------+
|                                ADMIN FLOW                               |
|   Admin Login -> Firebase Auth -> Server Authorization (admins/{uid})   |
|   Next.js Protected API Handlers -> Firestore DB / Storage Mutation    |
+-------------------------------------------------------------------------+
```

## Layer Responsibilities

### 1. Frontend UI Layer (`src/components/`, `src/app/`)
- Pure React components rendering frozen UI/UX designs.
- Handles responsive layouts, category navigation, modals, and brand loading animations.
- Minimizes client-side JavaScript by delegating business logic to services and API routes.

### 2. Validation & Security Layer (`src/lib/validation/`, `src/lib/security/`, `src/lib/rate-limit/`)
- **Validation:** Zod schemas enforce type constraints, required fields, percentage offer bounds, and positive price limits server-side.
- **Authorization:** `verifyAdminAuth` checks Firebase bearer tokens against `admins/{uid}` in Firestore before permitting any CRUD operation or upload.
- **Rate Limiting:** Sliding-window rate limiter prevents brute-force attacks on `/api/auth/login`, `/api/categories`, `/api/food-items`, and `/api/upload`.

### 3. Service Layer (`src/services/`)
- `categoryService.ts`: Category CRUD operations, ordering, and dependency safety checks (prevents deleting categories that contain active food items).
- `foodItemService.ts`: Food item CRUD, query filtering, and server-side `finalPrice` calculation from base price and percentage discounts.
- `businessService.ts`: Profile management and dynamic profile completion calculation.
- `seedService.ts`: Automatic database initialization from menu master records if Firestore collections are empty.

### 4. Media Storage & Image Processing Layer (`src/lib/supabase/`, `src/lib/media/`, `src/app/api/upload/`)
- **Supabase Storage:** Stores media assets (logo, category covers, food item photos) in `kings-platter-media` bucket.
- **Server-Side Sharp Engine (`src/lib/media/compressor.ts`):** Validates uploaded image format (`.jpg`, `.jpeg`, `.png`, `.webp`), resizes images up to max width 1920px, and transcodes JPG/PNG inputs into high-efficiency `.webp` format at quality 80% before uploading to Supabase.
- **Client Upload Utility (`src/utils/imageUpload.ts`):** Handles multipart upload POST requests to protected `/api/upload` route with admin authentication bearer tokens.

### 5. Firebase Persistence Layer (`src/lib/firebase/`)
- `client.ts`: Singleton browser Firebase SDK for client components.
- `server.ts`: Server-only Firebase Admin SDK for privileged Firestore operations.
- `firestore.rules`: Security rules enforcing public read access to menu data and admin-only write access.
- `storage.rules`: Security rules protecting image storage buckets.
