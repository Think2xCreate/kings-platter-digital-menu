'use client';

import React, { useContext } from 'react';
import { AdminContext } from '../layout';
import { BusinessProfileView } from '@/components/admin/Profile/BusinessProfileView';
import { ProfileSkeleton } from '@/components/admin/AdminSkeletons';

export default function AdminBusinessProfilePage() {
  const {
    business,
    isLoadingData,
    handleUpdateBusiness,
  } = useContext(AdminContext);

  if (isLoadingData || !business) {
    return <ProfileSkeleton />;
  }

  return (
    <BusinessProfileView
      business={business}
      onUpdateBusiness={handleUpdateBusiness}
    />
  );
}
