'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { adminAuth } from '@/services/adminAuth';
import { BrandLoader } from '@/components/common/BrandLoader';

export default function AdminPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!adminAuth.isAuthenticated()) {
      router.replace('/admin/login');
    } else {
      setIsAuthenticated(true);
      setIsCheckingAuth(false);
    }
  }, [router]);

  if (isCheckingAuth || !isAuthenticated) {
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
    <AdminDashboard
      onBackToCustomerMenu={() => {
        router.push('/');
      }}
    />
  );
}

