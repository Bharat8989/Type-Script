import { db } from '@/lib/db';

/**
 * Retrieves the two-factor confirmation record by user ID.
 * MongoDB does not support `.findUnique()`, so we use `.findFirst()`.
 */
export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findFirst({ // ✅ Changed to `.findFirst()`
      where: {
        userId,
      },
    });
    return twoFactorConfirmation;
  } catch (error) {
    console.log(`Error while getting two-factor confirmation: ${error}`);
    return null;
  }
};