'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLoginModal } from '@/components/admin/AdminLoginModal';
import { adminAuth } from '@/services/adminAuth';
import { BrandLoader } from '@/components/common/BrandLoader';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

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
