'use client'
import { redirect } from "next/navigation";
import Login from '@/components/auth/Login';
import { Suspense, useEffect, useState } from "react";
import React from 'react';

export const metadata = {
  title: "Login",
  description: "Access your CourseModule account to manage and create courses.",
};

const LoginPage = async () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Not logged in");
        return;
    }

    fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                console.log(data.error);
                localStorage.removeItem("token");
                setUser("not logged in")
            } else {
                setUser(data);
            }
        });
  }, []);

  if (user === "not logged in") {
    redirect("/");
  }

  return (
    <Suspense>
      <Login />
    </Suspense>
  );
};

export default LoginPage;
