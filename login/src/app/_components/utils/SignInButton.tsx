"use client";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignInButton() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  return (
    <button
      type="button"
      className="btn solid"
      onClick={() => signIn("google", { callbackUrl })}
    >
      sign in
    </button>
  );
}
