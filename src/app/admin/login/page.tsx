'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminLoginModal } from '@/components/admin/AdminLoginModal';
import { adminAuth } from '@/services/adminAuth';
import { BrandLoader } from '@/components/common/BrandLoader';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const isExpired = searchParams?.get('expired') === 'true';

  useEffect(() => {
    if (adminAuth.isAuthenticated()) {
      router.replace('/admin');
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  if (isCheckingAuth) {
    return (
      <BrandLoader
        isLoading={true}
        variant="admin"
        restaurantName="KING'S PLATTER"
        subName="ADMIN PORTAL"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E12] flex flex-col justify-between">
      <AdminLoginModal
        isOpen={true}
        isExpired={isExpired}
        onSuccess={() => {
          router.push('/admin');
        }}
        onCancel={() => {
          router.push('/');
        }}
      />
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <BrandLoader
          isLoading={true}
          variant="admin"
          restaurantName="KING'S PLATTER"
          subName="ADMIN PORTAL"
        />
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}

