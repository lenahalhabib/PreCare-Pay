"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, IdCard, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setErrorMessage("");

    if (!fullName || !nationalId || !email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMessage(
          error.message.includes("already")
            ? "This email is already registered."
            : error.message
        );
        return;
      }

      if (!data.user) {
        setErrorMessage("Failed to create account.");
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullName,
        national_id: nationalId,
        email,
      });

      if (profileError) {
        setErrorMessage("Failed to save profile.");
        return;
      }

      router.push("/create-plan");
    } catch (err) {
      console.error(err);
      setErrorMessage("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#D4E0DF] flex flex-col justify-center px-7">
      <section className="rounded-[36px] bg-[#F8FBFA] p-7 shadow-sm">
        <h1 className="font-serif text-5xl text-[#476973] text-center">
          Create Account
        </h1>

        <p className="mt-4 text-center text-[#476973]/75">
          Start comparing treatment plans and finding better options.
        </p>

        <div className="mt-10 space-y-5">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4">
            <User size={21} className="text-[#476973]" />
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-transparent text-[#476973] outline-none placeholder:text-[#476973]/45"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4">
            <IdCard size={21} className="text-[#476973]" />
            <input
              type="text"
              placeholder="National ID"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full bg-transparent text-[#476973] outline-none placeholder:text-[#476973]/45"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4">
            <Mail size={21} className="text-[#476973]" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-[#476973] outline-none placeholder:text-[#476973]/45"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4">
            <Lock size={21} className="text-[#476973]" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-[#476973] outline-none placeholder:text-[#476973]/45"
            />
          </div>

          {errorMessage && (
            <p className="rounded-2xl bg-red-50 p-3 text-sm font-medium text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            onClick={handleSignUp}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#476973] py-4 font-semibold text-white transition hover:bg-[#3d5d66] disabled:opacity-70"
          >
            {isLoading ? "Creating account..." : "SIGN UP"}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </div>

        <p className="mt-8 text-center text-[#476973]">
          Already have an account?{" "}
          <Link href="/login" className="font-bold hover:underline">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}