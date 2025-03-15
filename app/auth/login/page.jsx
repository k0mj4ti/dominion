import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Login from '@/components/auth/Login';
import { Suspense } from "react";
import React from 'react';

export const metadata = {
  title: "Login",
  description: "Access your CourseModule account to manage and create courses.",
};

const LoginPage = async () => {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return (
    <Suspense>
      <Login />
    </Suspense>
  );
};

export default LoginPage;
