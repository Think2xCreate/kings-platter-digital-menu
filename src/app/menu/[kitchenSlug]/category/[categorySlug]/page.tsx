'use client';

import React, { use } from 'react';
import { CustomerMenuView } from '@/components/menu/CustomerMenuView';

interface PageProps {
  params: Promise<{
    kitchenSlug: string;
    categorySlug: string;
  }>;
}

export default function CustomerCategoryPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return <CustomerMenuView initialCategorySlug={resolvedParams.categorySlug} />;
}
