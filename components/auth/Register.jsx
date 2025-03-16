"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { Eye, EyeOff, X } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [actualPassword, setActualPassword] = useState("");
  const [actualConfirmPassword, setActualConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [acceptedTos, setAcceptedTos] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validatePassword = (password) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmptyFields([]);
    let empty = [];

    if (!email) empty.push("email");
    if (!username) empty.push("username");
    if (!actualPassword) empty.push("password");
    if (!actualConfirmPassword) empty.push("confirmPassword");
    if (!acceptedTos) empty.push("tos");

    if (empty.length > 0) {
      setEmptyFields(empty);
      setError("Please fill in all fields and accept the TOS");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email address");
      setEmptyFields(["email"]);
      return;
    }

    if (!validatePassword(actualPassword)) {
      setError("Password must be 8+ chars, with 1 uppercase & 1 number");
      setEmptyFields(["password"]);
      return;
    }

    if (actualPassword !== actualConfirmPassword) {
      setError("Passwords do not match");
      setEmptyFields(["password", "confirmPassword"]);
      return;
    }

    setError(null);

    try {
      setSubmitting(true);
      const hashedPassword = await bcrypt.hash(actualPassword, 10);
      const response = await fetch("/api/auth/register", {
        method: 'POST',
        body: JSON.stringify({ email, username, password: hashedPassword }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setShowNotification(true);
      } else if (response.status === 406) {
        setError("OAUTH email, please sign in with Google");
      } else if (response.status === 409) {
        setError("Email already exists");
      } else {
        setError("Registration error");
      }
    } catch {
      setError("Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-300">
      <nav className="bg-gray-800 border-b border-gray-700 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-500">Dominion Login</h1>
        </div>
      </nav>
      {error && (
        <div className="fixed top-5 bg-red-600 text-white px-4 py-2 rounded-md shadow-md">{error}</div>
      )}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg max-w-[500px] mx-auto">
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Create an Account</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-200" />
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-200" />
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="Password" value={actualPassword} 
                onChange={(e) => setActualPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-200 pr-10" />
              <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" 
                value={actualConfirmPassword} onChange={(e) => setActualConfirmPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-200 pr-10" />
              <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <label className="flex items-center">
              <input type="checkbox" checked={acceptedTos} onChange={(e) => setAcceptedTos(e.target.checked)}
                className="mr-2" /> I accept the Terms of Service
            </label>
            <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
              disabled={submitting}>
              {submitting ? "Registering..." : "Register"}
            </button>
          </form>
          <div className="text-center mt-4 text-gray-400">
              Already have an account? <Link href="/auth/login" className="text-blue-400 hover:underline">Login</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
