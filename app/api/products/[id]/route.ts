import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { products } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // If the id is 'add', return an empty product template
  if (params.id === 'add') {
    return NextResponse.json({
      productName: '',
      tagline: '',
      targetAudience: '',
      mainUseCase: '',
      keyFeatures: [],
      problemsSolved: '',
      differentiators: '',
      successMetrics: '',
    });
  }

  try {
    const productId = parseInt(params.id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const [product] = await db.select().from(products).where(
      and(eq(products.id, productId), eq(products.userId, user.id))
    );

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  const { productName, tagline, targetAudience, mainUseCase, keyFeatures, problemsSolved, differentiators, successMetrics } = data;

  try {
    // If the id is 'add', create a new product
    if (params.id === 'add') {
      const [newProduct] = await db.insert(products).values({
        userId: user.id,
        productName,
        tagline,
        targetAudience,
        mainUseCase,
        keyFeatures,
        problemsSolved,
        differentiators,
        successMetrics,
      }).returning();

      return NextResponse.json(newProduct);
    }

    // Otherwise, update the existing product
    const productId = parseInt(params.id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const [updatedProduct] = await db.update(products)
      .set({
        productName,
        tagline,
        targetAudience,
        mainUseCase,
        keyFeatures,
        problemsSolved,
        differentiators,
        successMetrics,
        updatedAt: new Date(),
      })
      .where(and(eq(products.id, productId), eq(products.userId, user.id)))
      .returning();

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [deletedProduct] = await db.delete(products)
      .where(and(eq(products.id, parseInt(params.id)), eq(products.userId, user.id)))
      .returning();

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}