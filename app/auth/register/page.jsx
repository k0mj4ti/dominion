'use client'
import { redirect } from "next/navigation";

import { Suspense, useEffect, useState } from "react";
import React from 'react';
import Register from "@/components/auth/Register";


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

  if (user) {
    redirect("/");
  }

  return (
    <Register/>
  )
}

export default RegisterPage