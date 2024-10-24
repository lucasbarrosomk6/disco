'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProductActionsProps {
  productId: string;
}

export function ProductActions({ productId }: ProductActionsProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSeeMore = () => {
    router.push(`/dashboard/products/${productId}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      console.log(`Deleted product with ID: ${productId}`);
      setShowDeleteModal(false);
      // Optionally, refresh the page or update the state to reflect the deletion
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button
        onClick={handleSeeMore}
        className="text-blue-600 hover:text-blue-900 mr-4"
      >
        See More
      </button>
      <button
        onClick={handleDelete}
        className="text-red-600 hover:text-red-900"
      >
        Delete
      </button>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p>Are you sure you want to delete this product?</p>
            <button
              onClick={confirmDelete}
              className="text-red-600 hover:text-red-900 mr-4"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
