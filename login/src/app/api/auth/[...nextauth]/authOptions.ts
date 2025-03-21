import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { clientPromise } from "@/app/lib/mongoDB";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        credentials ??= { email: "", password: "" };
        console.log("im inside segment authorize");
        const client = await clientPromise;
        const db = client.db();
        console.log("im below db connection");
        const user = await db.collection("users").findOne({
          email: credentials?.email,
        });
        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise) as any,
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.TOKEN_SECRET ?? "defaultkey",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};
