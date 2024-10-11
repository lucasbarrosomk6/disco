import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { teamMembers, users } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const teamMember = await db.query.teamMembers.findFirst({
      where: eq(teamMembers.userId, user.id),
    });

    if (!teamMember) {
      return NextResponse.json({ error: 'User is not part of a team' }, { status: 404 });
    }

    const teamMembersData = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: teamMembers.role,
    })
    .from(teamMembers)
    .innerJoin(users, eq(teamMembers.userId, users.id))
    .where(eq(teamMembers.teamId, teamMember.teamId));

    return NextResponse.json(teamMembersData);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}