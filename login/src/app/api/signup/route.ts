import { clientPromise } from "../../lib/mongoDB"; // Updated import statement using connectToDatabase
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
export const maxDuration = 60;
export async function POST(req: Request, res: Response) {
  try {
    const { name, email, password } = await req.json();
    console.log("im inside creation route");
    const client = await clientPromise;
    const db = client.db();

    console.log("im below db connection");
    const user = await db.collection("users").findOne({ email: email });
    if (user) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
    });

    const secretKey = process.env.TOKEN_SECRET ?? "secretkey";

    // Generate JWT
    const token = jwt.sign(
      {
        // Use the insertedId as the subject
        email: email,
      },
      secretKey,
      { expiresIn: "1h" } // Token expires in 1 hour
    );
    return NextResponse.json({ message: "User created.", token: token });
  } catch (error) {
    console.error("registration error: " + error);
    return NextResponse.json({ message: "Internal server error." });
  }
}
