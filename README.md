# King's Platter — QR Digital Menu Web Application

Production-ready full-stack QR digital menu web application built with **Next.js App Router**, **Tailwind CSS**, and **Firebase (Cloud Firestore, Authentication, Storage)**.

---

## Technical Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS v4
- **Database:** Firebase Cloud Firestore
- **Authentication:** Firebase Authentication & Server-side Authorization (`admins/{uid}`)
- **File Storage:** Supabase Storage (`kings-platter-media` bucket)
- **Image Processing:** Sharp Engine (Server-side WebP compression & JPG/PNG transcoding)
- **Validation:** Zod Schema Validation
- **Rate Limiting:** Sliding Window Rate Limiter
- **Icons & Motion:** Lucide React & Framer Motion

---

## Documentation

- 📘 [Architecture Documentation](docs/ARCHITECTURE.md)
- 🗄️ [Supabase Storage Setup & Policy Guide](docs/SUPABASE.md)

---

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local` and add your Firebase credentials:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` for Customer Menu and `http://localhost:3000/admin` for Admin Dashboard.

### 4. Build for Production
```bash
npm run build
npm run start
```
