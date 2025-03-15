import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Register from '@/components/auth/Register'
import { getServerSession } from 'next-auth'
import { redirect } from "next/navigation";
import React from 'react'

export const metadata = {
  title: "Register",
  description: "Access your CourseModule account to create, manage and learn courses.",
};

const RegisterPage = async () => {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }
  return (
    <Register/>
  )
}

export default RegisterPage