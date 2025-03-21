import React from "react";
import { SignIn } from "./_components/SignInForm";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import SignOutButton from "./_components/utils/SignOutButton";

const page = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      {session ? (
        /* <SignIn /> */
        <div className="flex flex-col">
          <h1 className="text-center">
            hello {session.user?.name} you are signed in
          </h1>
          <SignOutButton />
        </div>
      ) : (
        <div>
          <button className="btn solid flex justify-center items-center">
            <a href="/signin"> go to sign in </a>
          </button>
        </div>
      )}
    </div>
  );
};

export default page;
