"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInButton() {
  const { data: session } = useSession();
  const callbackUrl = "/";
  // console.log(session);
  return (
    <button
      type="button"
      className="bg-sky-400 rounded-md px-4 py-2"
      onClick={() => signOut({ callbackUrl })}
    >
      sign out
    </button>
  );
}
