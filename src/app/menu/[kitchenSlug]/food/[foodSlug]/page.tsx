'use client';

import React, { use } from 'react';
import { CustomerMenuView } from '@/components/menu/CustomerMenuView';

interface PageProps {
  params: Promise<{
    kitchenSlug: string;
    foodSlug: string;
  }>;
}

export default function CustomerFoodPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return <CustomerMenuView initialFoodSlug={resolvedParams.foodSlug} />;
}
