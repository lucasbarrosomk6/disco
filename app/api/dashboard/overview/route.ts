import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { getUser, getActivityLogs } from '@/lib/db/queries';
import { products } from '@/lib/db/schema';
import { desc, sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [totalProductsResult, recentProducts, activityLogs] = await Promise.all([
      db.select({ count: sql<number>`count(*)` })
        .from(products)
        .where(sql`user_id = ${user.id}`),
      db.select().from(products).orderBy(desc(products.createdAt)).limit(5),
      getActivityLogs(),
    ]);

    const totalProducts = totalProductsResult[0].count;

    const response = NextResponse.json({
      totalProducts,
      recentProducts,
      user,
      activityLogs,
    });

    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

    return response;
  } catch (error) {
    console.error('Error fetching overview data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
