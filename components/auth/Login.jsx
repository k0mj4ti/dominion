"use client";
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);


    const callbackUrl = '/';

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 3000); 
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmptyFields([]);
        let empty = [];

        if (email.length === 0) empty.push("email");
        if (password.length === 0) empty.push("password");

        setEmptyFields(empty);

        if (empty.length > 0) {
            setNotification("Please fill in all the fields!");
            return;
        }

        if (!validateEmail(email)) {
            setNotification("This email is not valid");
            setEmptyFields(["email"]);
            return;
        }

        setError(null);
        try {
            setSubmitting(true);
            const response = await signIn("credentials", { 
                email, 
                password, 
                redirect: false,
                callbackUrl: callbackUrl 
            });

            if (response?.error) {
                setNotification(response.error || "Invalid credentials");
                return;
            }

            router.push("/");
        } catch (error) {
            setNotification("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-gray-300">
            <nav className="bg-gray-800 border-b border-gray-700 shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-blue-500 cursor-pointer">Dominion Login</h1>
                        </div>
                    </div>
                </div>
            </nav>
            
            {notification && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-600 z-50 text-white px-4 py-2 rounded-md shadow-md">
                    {notification}
                </div>
            )}
        
            <main className="container mx-auto px-4 py-8 flex-grow">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg max-w-[500px] mx-auto">
                    <h2 className="text-2xl font-bold text-gray-100 mb-6">Welcome Back!</h2>
                    <p className="text-gray-400 mb-6">Please log in to continue.</p>
            
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-300 mb-2">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                name="username"
                                autoComplete="username"
                                className={`w-full bg-gray-700 border ${emptyFields.includes("email") ? "border-red-500" : "border-gray-600"} rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600`}
                            />
                        </div>
            
                        <div>
                            <label className="block text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    name="password"
                                    autoComplete="current-password"
                                    className={`w-full bg-gray-700 border ${emptyFields.includes("password") ? "border-red-500" : "border-gray-600"} rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
            
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                        >
                            {submitting ? "Logging in..." : "Login"}
                        </button>
                    </form>
            
                    <div className="text-center mt-4 text-gray-400">
                        Don't have an account?{" "}
                        <Link href="/auth/register" className="text-blue-400 hover:underline">
                            Register
                        </Link>
                    </div>
                </div>
            </main>
        
            <footer className="bg-gray-800 border-t border-gray-700 py-4">
                <div className="container mx-auto px-4">
                    <div className="text-center text-gray-400 text-sm">
                        Dominion Login &copy; {new Date().getFullYear()}
                    </div>
                </div>
            </footer>
        </div>
    );
};
    
export default Login;