import { desc, and, eq, isNull } from 'drizzle-orm';
import { db } from './drizzle';
import { activityLogs, teamMembers, teams, users } from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';
import { PlanInfo } from '@/lib/plan';

export async function getUser() {
  const sessionCookie = cookies().get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
 
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== 'number'
  ) {
    console.log('No session data or user ID is not a number');
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    console.log('Session expired');
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);
  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getTeamByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(teams.id, teamId));
}

export async function getUserWithTeam(userId: number) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function getActivityLogs() {
  console.log("getActivityLogs")
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name,
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function getTeamForUser(userId: number) {
  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      teamMembers: {
        with: {
          team: {
            with: {
              teamMembers: {
                with: {
                  user: {
                    columns: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return result?.teamMembers[0]?.team || null;
}

export async function getUserPlan(userId: number): Promise<PlanInfo | null> {
  const userWithTeam = await getUserWithTeam(userId);
  if (!userWithTeam || !userWithTeam.teamId) {
    return null;
  }

  // Fetch the full team information
  const team = await db.query.teams.findFirst({
    where: eq(teams.id, userWithTeam.teamId),
  });

  if (!team || !team.planName) {
    return null;
  }

  const planName = team.planName;

  // Define plan details based on the plan name
  const planDetails: Record<string, PlanInfo> = {
    'Free Trial': {
      name: 'Free Trial',
      price: 0,
      interval: '14 days',
      features: [
        'Up to 5 comprehensive company reports',
        'Full access to all basic features',
        'No credit card required',
      ],
    },
    'Basic': {
      name: 'Basic',
      price: 29,
      interval: 'month',
      features: [
        'Up to 10 reports per month',
        'Instant company reports',
        'Personalized value propositions',
      ],
    },
    'Pro': {
      name: 'Pro',
      price: 99,
      interval: 'month',
      features: [
        'Up to 50 reports per month',
        'All features in Basic Plan',
        'Advanced insights',
        'Priority email support',
      ],
    },
    'Premium': {
      name: 'Premium',
      price: 199,
      interval: 'month',
      features: [
        'Unlimited reports',
        'All features in Pro Plan',
        'Early access to new features',
        'Dedicated customer success manager',
      ],
    },
  };

  return planDetails[planName as keyof typeof planDetails] || null;
}
