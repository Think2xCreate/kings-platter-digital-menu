# Supabase Storage Integration — King's Platter

This document provides instructions for setting up and configuring Supabase Storage for the King's Platter Digital Menu Web Application.

---

## Overview

King's Platter uses **Supabase Storage** to store all media assets (business logo, menu category icons/covers, and food item images). 

- **Storage Bucket Name:** `kings-platter-media`
- **Supported File Formats:** `.jpg`, `.jpeg`, `.png`, `.webp`
- **Server Optimization:** All uploaded images (PNG/JPG) are automatically converted to lightweight `.webp` format and compressed using `sharp` on the server before being uploaded to Supabase.
- **Folder Structure:**
  - `business/` — Restaurant logo & branding assets
  - `categories/` — Menu category thumbnails & banners
  - `food-items/` — Food dish images

---

## 1. Supabase Project Setup

1. Log into [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project (or create a new project named `kings-platter`).
3. Navigate to **Storage** from the left navigation sidebar.
4. Click **New Bucket**.

### Bucket Settings

- **Name:** `kings-platter-media`
- **Public Bucket:** **YES** (Toggle ON so image URLs can be publicly read by menu visitors)
- **Allowed MIME types:** (Optional, leaving empty allows server control) or `image/jpeg, image/png, image/webp`
- **File size limit:** `10MB`

---

## 2. Row Level Security (RLS) & Storage Policies

Because media uploads are executed server-side via the Next.js API route (`/api/upload`) using the `SUPABASE_SERVICE_ROLE_KEY`, server uploads bypass RLS automatically.

To ensure public read access for customer menu visitors, add the following policy to the `kings-platter-media` bucket:

### Public Read Policy

Go to **Storage** -> **Policies** -> **kings-platter-media**:

```sql
-- Allow public read access to all files in kings-platter-media bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'kings-platter-media');
```

---

## 3. Environment Variables Configuration

Add the following keys to `.env.local` (local environment) and Vercel / production environment settings:

```env
# Supabase Configuration
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_MEDIA_BUCKET=kings-platter-media
```

> ⚠️ **SECURITY WARNING:** 
> - Never prefix `SUPABASE_SERVICE_ROLE_KEY` with `NEXT_PUBLIC_`.
> - Keep `SUPABASE_SERVICE_ROLE_KEY` strictly on the server-side to prevent unauthorized storage access.

---

## 4. API & Upload Workflow Architecture

```
[Admin UI] 
    ↓ (File input: .jpg, .png, .webp)
[Client Utility: uploadImageToSupabase()]
    ↓ (Multipart FormData POST with Auth Token)
[Next.js API Route: /api/upload]
    ↓ 
[Server Validator & Compressor: compressAndConvertToWebP()]
    ↓ (Converts JPG/PNG -> WebP with Sharp, Quality: 80, Max Width: 1920px)
[Supabase Server SDK: supabase.storage.from('kings-platter-media').upload()]
    ↓
[Public CDN URL Returned] -> Saved to Firestore / Business Profile / Category / Food Item
```

---

## 5. Graceful Fallback Mode

If Supabase Storage credentials (`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`) are not provisioned in local development:
- The application automatically logs a warning.
- Media services fall back to using default asset paths (`/kings_platter_logo.jpg`, etc.) or data URLs without crashing.
