import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { reports } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const resolvedParams = await params;
        const reportId = parseInt(resolvedParams.id);
        if (isNaN(reportId)) {
            return NextResponse.json({ error: 'Invalid report ID' }, { status: 400 });
        }

        const [report] = await db.select().from(reports).where(eq(reports.id, reportId));

        if (!report) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }

        if (report.userId !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const response = NextResponse.json(report);
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

        return response;
    } catch (error) {
        console.error('Error fetching report:', error);
        return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const user = await getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { productName, company, sections } = data;

    try {
        const userId = user.id;
        if (isNaN(userId)) {
            return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
        }

        const reportId = parseInt(params.id);
        if (isNaN(reportId)) {
            return NextResponse.json({ error: 'Invalid report ID' }, { status: 400 });
        }

        const [updatedReport] = await db.update(reports)
            .set({
                sections, company, productName,
                updatedAt: new Date(),
            })
            .where(and(eq(reports.id, reportId), eq(reports.userId, userId)))
            .returning();

        if (!updatedReport) {
            return NextResponse.json({ error: 'Report not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json(updatedReport);
    } catch (error) {
        console.error('Error updating report:', error);
        return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
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

        const reportId = parseInt(params.id);
        if (isNaN(reportId)) {
            return NextResponse.json({ error: 'Invalid report ID' }, { status: 400 });
        }

        const [deletedReport] = await db.delete(reports)
            .where(and(eq(reports.id, reportId), eq(reports.userId, userId)))
            .returning();

        if (!deletedReport) {
            return NextResponse.json({ error: 'Report not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
    }
} 