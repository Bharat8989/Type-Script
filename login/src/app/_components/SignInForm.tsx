"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
// Importing icons from react-icons
import { MdEmail, MdLock } from "react-icons/md";
import { FaGoogle, FaGithub } from "react-icons/fa";

export const SignIn = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      callbackUrl,
    });
  };
  return (
    <div className="">
      <form onSubmit={handleSubmit} action="" className="sign-in-form">
        <h2 className="title">Sign In</h2>
        <div className="input-field flex items-center">
          <div className="ml-3">
            <MdEmail />
          </div>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-field flex items-center ml-14">
          <div className="ml-3">
            <MdLock />
          </div>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn solid">
          sign in
        </button>
        <p className="social-text">Or Sign in with social platforms</p>
        <div className="social-media">
          <div
            className="social-icon "
            onClick={() => signIn("google", { callbackUrl })}
            style={{ cursor: "pointer" }}
          >
            <FaGoogle />
          </div>
          <div
            className="social-icon flex items-center"
            onClick={() => signIn("github", { callbackUrl })}
            style={{ cursor: "pointer" }}
          >
            <FaGithub />
          </div>
        </div>
      </form>
    </div>
  );
};
