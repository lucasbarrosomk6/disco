import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { getUser, getActivityLogs } from '@/lib/db/queries';
import { products } from '@/lib/db/schema';
import { desc, sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  console.log("overview")
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch total products count
  const totalProductsResult = await db.select({ count: sql<number>`count(*)` })
    .from(products)
    .where(sql`user_id = ${user.id}`);
  const totalProducts = totalProductsResult[0].count;

  // Fetch recent products
  const recentProducts = await db.select().from(products).orderBy(desc(products.createdAt)).limit(5);

  // Fetch recent activity logs
  const activityLogs = await getActivityLogs();

  return NextResponse.json({
    totalProducts,
    recentProducts,
    user,
    activityLogs,
  });
}
