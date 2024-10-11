'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';

interface ProductDetails {
  id: number;
  productName: string;
  tagline: string;
  targetAudience: string;
  mainUseCase: string;
  keyFeatures: string[];
  problemsSolved: string;
  differentiators: string;
  successMetrics: string;
  createdAt: string;
  updatedAt: string;
}

export default function ViewProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          throw new Error('Failed to fetch product');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="border-t-4 border-blue-600">
        <CardHeader>
          <CardTitle className="text-blue-600">{product.productName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-600 mb-4">{product.tagline}</p>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <h3 className="font-semibold">Target Audience</h3>
              <p>{product.targetAudience}</p>
            </div>
            <div>
              <h3 className="font-semibold">Main Use Case</h3>
              <p>{product.mainUseCase}</p>
            </div>
            <div>
              <h3 className="font-semibold">Key Features</h3>
              <ul className="list-disc list-inside">
                {product.keyFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Problems Solved</h3>
              <p>{product.problemsSolved}</p>
            </div>
            <div>
              <h3 className="font-semibold">Differentiators</h3>
              <p>{product.differentiators}</p>
            </div>
            <div>
              <h3 className="font-semibold">Success Metrics</h3>
              <p>{product.successMetrics}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => router.push('/dashboard/products')} className="text-blue-600 border-blue-600 hover:bg-blue-50">
              Back to Products
            </Button>
            <Button onClick={() => router.push(`/dashboard/products/${product.id}/edit`)} className="bg-blue-600 hover:bg-blue-700 text-white">
              Edit Product
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}