import { db } from '@/lib/db';

// export const getVerificationTokenByEmail = async (email: string) => {
//   try {
//     const verificationToken = await db.verificationToken.findFirst({
//       where: {
//         email: email,
//       },
//     });
//     return verificationToken;
//   } catch (error) {
//     console.log(`Error while getting verification token: ${error}`);
//     return null;
//   }
// };

// export const getVerificationTokenByToken = async (token: string) => {
//   try {
//     const verificationToken = await db.verificationToken.findUnique({
//       where: {
//         token,
//       },
//     });
//     return verificationToken;
//   } catch (error) {}
// };


export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        email: email,
      },
    });
    return verificationToken;
  } catch (error) {
    console.log(`Error while getting verification token by email: ${error}`);
    return null;
  }
};