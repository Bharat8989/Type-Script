import { db } from '@/lib/db';

// export const getTwoFactorTokenByToken = async (token: string) => {
//   try {
//     const twoFactorToken = await db.twoFactorToken.findUnique({
//       where: {
//         token: token,
//       },
//     });
//     return twoFactorToken;
//   } catch (error) {
//     console.log(`Error while getting two factor token: ${error}`);
//     return null;
//   }
// };
// export const getTwoFactorTokenByEmail = async (email: string) => {
//   try {
//     const twoFactorToken = await db.twoFactorToken.findFirst({
//       where: {
//         email: email,
//       },
//     });
//     return twoFactorToken;
//   } catch (error) {
//     console.log(`Error while getting two factor token: ${error}`);
//     return null;
//   }
// };


export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({ // ✅ Changed to `.findFirst()`
      where: {
        token: token,
      },
    });
    return twoFactorToken;
  } catch (error) {
    console.log(`Error while getting two-factor token: ${error}`);
    return null;
  }
};

/**
 * Retrieves a two-factor token by user email.
 */
export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: {
        email: email,
      },
    });
    return twoFactorToken;
  } catch (error) {
    console.log(`Error while getting two-factor token by email: ${error}`);
    return null;
  }
};
