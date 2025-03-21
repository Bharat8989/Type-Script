"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import SignInButton from "../_components/utils/SignInButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import SignOutButton from "../_components/utils/SignOutButton";
import { SignIn } from "../_components/SignInForm";
import { SignUp } from "../_components/SignUpForm";
import log from "@/app/_assets/log.svg";
import register from "@/app/_assets/register.svg";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Signin() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");
  // const router = useRouter();
  const handleSignUpClick = () => {
    setIsSignUpMode(true);
  };
  const handleSignInClick = () => {
    setIsSignUpMode(false);
  };
  // const session = await getServerSession(authOptions);
  // console.log(session);
  return (
    <div className="big-container">
      <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
        <div className="forms-container">
          <div className="signin-signup">
            {isSignUpMode ? <SignUp /> : <SignIn />}
            {/* {errorMessage && <p className="error-message">{errorMessage}</p>} */}
          </div>
        </div>
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here?</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
                minus natus est.
              </p>
              <button
                className="btn transparent"
                id="sign-up-btn"
                onClick={handleSignUpClick}
              >
                Sign Up
              </button>
            </div>
            <Image src={log} width={45} alt="" className="image" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us?</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
                minus natus est.
              </p>
              <button
                className="btn transparent"
                id="sign-in-btn"
                onClick={handleSignInClick}
              >
                Sign In
              </button>
            </div>
            <Image src={register} width={45} className="image" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
