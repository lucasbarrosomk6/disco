'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

interface Product {
  id: number;
  productName: string;
  tagline: string;
  createdAt: string;
  keyFeatures: string | string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (e) {
        console.error('Error fetching products:', e);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Your Products</h1>
        <Link href="/dashboard/products/add">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </Link>
      </div>
      <div className="space-y-4">
        {products.map((product) => (
          <Card key={product.id} className="w-full border border-gray-200">
            <CardHeader>
              <CardTitle className="text-blue-600">{product.productName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">{product.tagline}</p>
              <p className="text-xs text-gray-400 mb-2">
                Created: {new Date(product.createdAt).toLocaleDateString()}
              </p>
              <div className="mb-4">
                <strong className="text-gray-600">Key Features:</strong>
                <ul className="list-disc list-inside text-gray-600">
                  {Array.isArray(product.keyFeatures) 
                    ? product.keyFeatures.slice(0, 3).map((feature, index) => (
                        <li key={index} className="text-sm">{feature}</li>
                      ))
                    : <li className="text-sm">{product.keyFeatures}</li>
                  }
                </ul>
                {Array.isArray(product.keyFeatures) && product.keyFeatures.length > 3 && (
                  <p className="text-sm text-gray-500 mt-1">and {product.keyFeatures.length - 3} more...</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Link href={`/dashboard/products/${product.id}`}>
                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">View Details</Button>
                </Link>
                <Link href={`/dashboard/products/${product.id}/edit`}>
                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}