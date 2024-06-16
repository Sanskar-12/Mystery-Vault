"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const SignIn = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        Signed In as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign Out</button>
      </>
    );
  }

  return (
    <>
      <button onClick={() => signIn()}>Sign In</button>
    </>
  );
};

export default SignIn;
