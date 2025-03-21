import { getUserByEmail, getUserById } from './utils/user';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { UserRole } from '@prisma/client';
import authConfig from './auth.config';
import { db } from './lib/db';
import { getTwoFactorConfirmationByUserId } from './helper/two-factor-confirmataion';
import { getTwoFactorTokenByEmail } from './helper/two-factor-token';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  adapter: PrismaAdapter(db),
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/register',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  events: {
    async linkAccount({ user }) {
      if (!user?.id) return; // Ensure user ID exists
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (!user || !user.email) return false;
        if (account?.provider !== 'credentials') return true;

        const existingUser = await getUserByEmail(user.email);

        if (!existingUser || !existingUser.emailVerified) {
          return false;
        }

        if (existingUser.isTwoFactorEnabled) {
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
            existingUser.id
          );

          if (!twoFactorConfirmation) {
            return false;
          }

          await db.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id },
          });
        }

        return true;
      } catch (error) {
        console.error('Sign-in error:', error);
        return false;
      }
    },
    async jwt({ token }) {
      try {
        if (!token.sub) return token;
        
        const existingUser = await getUserById(token.sub);
        
        if (existingUser) {
          token.role = existingUser.role || 'USER';
        }

        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        return token;
      }
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as UserRole) || 'USER';
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  ...authConfig,
});
