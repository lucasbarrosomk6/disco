import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { products } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { eq, desc } from 'drizzle-orm';

export async function POST(request: Request) {
    console.log("products POST")
  const user = await getUser();
  console.log("user", user)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  const { productName, tagline, targetAudience, mainUseCase, keyFeatures, problemsSolved, differentiators, successMetrics } = data;

  try {
    const [product] = await db.insert(products).values({
      userId: Number(user.id),  // Convert string to number
      productName,
      tagline,
      targetAudience,
      mainUseCase,
      keyFeatures: JSON.stringify(keyFeatures),
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

    const formattedProducts = allProducts.map(product => {
      let parsedKeyFeatures;
      try {
        parsedKeyFeatures = JSON.parse(product.keyFeatures as string);
      } catch (parseError) {
        console.error('Error parsing keyFeatures:', parseError);
        parsedKeyFeatures = []; // Default to an empty array or handle as needed
      }

      return {
        ...product,
        keyFeatures: parsedKeyFeatures,
      };
    });

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
