import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { products } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { eq, desc } from 'drizzle-orm';

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  const { productName, tagline, targetAudience, mainUseCase, keyFeatures, problemsSolved, differentiators, successMetrics } = data;

  try {
    const [product] = await db.insert(products).values({
      userId: Number(user.id),
      productName,
      tagline,
      targetAudience,
      mainUseCase,
      keyFeatures,
      problemsSolved,
      differentiators,
      successMetrics,
    }).returning();

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userId = parseInt(req.nextUrl.searchParams.get('userId') || '');
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allProducts = await db.select()
      .from(products)
      .where(eq(products.userId, userId))
      .orderBy(desc(products.createdAt));

    const formattedProducts = allProducts.map(product => ({
      ...product,
      keyFeatures: product.keyFeatures,
    }));

    const response = NextResponse.json(formattedProducts);
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
