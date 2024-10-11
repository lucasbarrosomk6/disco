'use server'

import { z } from 'zod';
import { db } from '@/lib/db/drizzle';
import { teams } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUser } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';
import { getUserWithTeam } from '@/lib/db/queries';

const updateSubscriptionSchema = z.object({
  planName: z.enum(['Free Trial', 'Basic', 'Pro', 'Premium']),
});

export async function updateTeamSubscription(prevState: any, formData: FormData) {
  const user = await getUser();
  
  if (!user) {
    return { error: 'User not authenticated' };
  }
  const userWithTeam = await getUserWithTeam(user.id);
  const validatedFields = updateSubscriptionSchema.safeParse({
    planName: formData.get('planName'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid plan name' };
  }

  const { planName } = validatedFields.data;

  try {
    const [updatedTeam] = await db
      .update(teams)
      .set({ 
        planName: planName,
        subscriptionStatus: 'active',
        updatedAt: new Date(),
      })
      .where(eq(teams.id, userWithTeam.teamId!))
      .returning();

    if (!updatedTeam) {
      return { error: 'Failed to update subscription' };
    }

    revalidatePath('/dashboard/pricing');
    return { success: true, message: 'Subscription updated successfully' };
  } catch (error) {
    console.error('Error updating team subscription:', error);
    return { error: 'An error occurred while updating the subscription' };
  }
}