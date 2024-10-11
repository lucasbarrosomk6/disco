import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { products } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  const { productName, tagline, targetAudience, mainUseCase, keyFeatures, problemsSolved, differentiators, successMetrics } = data;

  try {
    const [product] = await db.insert(products).values({
      userId: user.id,
      productName,
      tagline,
      targetAudience,
      mainUseCase,
      keyFeatures: JSON.stringify(keyFeatures),  // Stringify the array
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

export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userProducts = await db.select().from(products).where(eq(products.userId, user.id));
    console.log('Fetched products:', JSON.stringify(userProducts, null, 2));

    // Parse keyFeatures back to an array
    const parsedProducts = userProducts.map(product => {
      let parsedKeyFeatures;
      try {
        parsedKeyFeatures = typeof product.keyFeatures === 'string' 
          ? JSON.parse(product.keyFeatures) 
          : product.keyFeatures;
      } catch (error) {
        console.error('Error parsing keyFeatures:', error);
        parsedKeyFeatures = product.keyFeatures; // Keep the original value if parsing fails
      }
      
      return {
        ...product,
        keyFeatures: parsedKeyFeatures
      };
    });

    console.log('Parsed products:', JSON.stringify(parsedProducts, null, 2));

    return NextResponse.json(parsedProducts);
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}