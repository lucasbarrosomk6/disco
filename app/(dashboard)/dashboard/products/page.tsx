import { Suspense } from 'react';
import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import DashboardShell from '@/components/dashboard/dashboard-shell';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import {ProductList} from '@/components/dashboard/product-list';
import { User } from '@/lib/db/schema';

async function getProducts() {
  try {
    const user = await getUser();
    if (!user) {
      return [];
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard/products?userId=${user.id}`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsPage() {
  


  const products = await getProducts();

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Products"
        text="Manage your products here."
      />
      <Suspense fallback={<DashboardSkeleton />}>
        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <p>No products found. Create your first product to get started!</p>
        )}
      </Suspense>
    </DashboardShell>
  );
}
