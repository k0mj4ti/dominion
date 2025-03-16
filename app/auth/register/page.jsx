'use client'
import { redirect } from "next/navigation";
import Login from '@/components/auth/Login';
import { Suspense, useEffect, useState } from "react";
import React from 'react';


const RegisterPage = async () => {
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
    <Register/>
  )
}

export default RegisterPage