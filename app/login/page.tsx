"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          setErrorMessage("Incorrect email or password.");
        } else {
          setErrorMessage("Unable to login. Please try again.");
        }
        return;
      }

      router.push("/home");
    } catch (err) {
      console.error(err);
      setErrorMessage("Connection error. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#D4E0DF] flex flex-col justify-center items-center px-8">

      <h1 className="text-5xl font-serif text-[#476973]">
        Login
      </h1>

      <div className="mt-12 w-full max-w-sm space-y-5">

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl bg-white p-4 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl bg-white p-4 outline-none"
        />

        {errorMessage && (
          <p className="text-red-600 text-sm font-medium px-2">
            {errorMessage}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="w-full rounded-2xl bg-[#476973] py-4 text-white font-semibold hover:bg-[#3d5d66] transition"
        >
          LOGIN
        </button>

        <p className="mt-6 text-center text-[#476973]">
          Don't have an account?{" "}
          <Link href="/signup" className="font-bold hover:underline">
            Sign Up
          </Link>
        </p>

      </div>

    </main>
  );
}