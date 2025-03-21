import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import NextAuth from "next-auth";
import { authOptions } from "./authOptions";
export const maxDuration = 60;
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
