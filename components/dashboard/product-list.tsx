'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Plus, Pencil, Trash } from 'lucide-react';

interface Product {
  id: string;
  productName: string;
  tagline?: string;
  keyFeatures: string[];
}

export function ProductList({ products: initialProducts }: { products: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const router = useRouter();

  const filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tagline?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/dashboard/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter((product) => product.id !== id));
      setDeleteProductId(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  // Cleanup pointer-events and overlays when the dialog closes
  useEffect(() => {
    if (deleteProductId === null) {
      // Remove pointer-events: none from the body
      document.body.style.pointerEvents = '';
      // Remove any inline styles from the body
      document.body.removeAttribute('style');
      // Remove any classes that might have been added to the body
      document.body.classList.remove('dialog-open', 'modal-open', 'prevent-scroll');
      // Remove any lingering overlays
      const overlays = document.querySelectorAll(
        '[data-radix-dialog-overlay], .dialog-overlay, .modal-overlay'
      );
      overlays.forEach((overlay) => overlay.remove());
    }
  }, [deleteProductId]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => router.push('/dashboard/products/add')}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Product Name</TableHead>
              <TableHead className="w-[50%]">Tagline</TableHead>
              <TableHead className="w-[10%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      className="hover:underline"
                    >
                      {product.productName}
                    </Link>
                  </TableCell>
                  <TableCell>{product.tagline || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/products/${product.id}`)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setDeleteProductId(product.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={deleteProductId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteProductId(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the product and remove
              its data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteProductId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteProductId && handleDeleteProduct(deleteProductId)}
            >
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
