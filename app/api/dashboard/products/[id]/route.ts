import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { products } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const productId = parseInt(params.id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const [product] = await db.select().from(products).where(eq(products.id, productId));
    if (product.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const response = NextResponse.json(product);
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

    return response;
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
    const userId = user.id;
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }


    // If the id is 'add', create a new product
    if (params.id === 'add') {
      const [newProduct] = await db.insert(products).values({
        userId,
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
      .where(and(eq(products.id, productId), eq(products.userId, userId)))
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
    const userId = user.id;
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Fetch the user's team ID




    const productId = parseInt(params.id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const [deletedProduct] = await db.delete(products)
      .where(and(eq(products.id, productId), eq(products.userId, userId)))
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
