"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async () => {
    setErrorMessage("");

    if (!fullName || !nationalId || !email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("already")) {
          setErrorMessage("This email is already registered.");
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      if (!data.user) {
        setErrorMessage("Failed to create account.");
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          full_name: fullName,
          national_id: nationalId,
        });

      if (profileError) {
        setErrorMessage("Failed to save profile.");
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
        Sign Up
      </h1>

      <div className="mt-12 w-full max-w-sm space-y-5">

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-2xl bg-white p-4 outline-none"
        />

        <input
          type="text"
          placeholder="National ID"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value)}
          className="w-full rounded-2xl bg-white p-4 outline-none"
        />

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
          onClick={handleSignUp}
          className="w-full rounded-2xl bg-[#476973] py-4 text-white font-semibold hover:bg-[#3d5d66] transition"
        >
          SIGN UP
        </button>

        <p className="mt-6 text-center text-[#476973]">
          Already have an account?{" "}
          <Link href="/login" className="font-bold hover:underline">
            Login
          </Link>
        </p>

      </div>

    </main>
  );
}