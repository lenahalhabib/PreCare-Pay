"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  IdCard,
  Mail,
  Lock,
  LogOut,
  Save,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import BottomNavigation from "@/shared/components/navigation/BottomNavigation";

export default function ProfilePage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setEmail(user.email || "");

    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, national_id")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setFullName(data.full_name || "");
      setNationalId(data.national_id || "");
    }

    setLoading(false);
  };

  const handleSave = async () => {
    setMessage("");
    setErrorMessage("");
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        national_id: nationalId,
      })
      .eq("id", user.id);

    if (profileError) {
      setErrorMessage("Failed to update profile.");
      setSaving(false);
      return;
    }

    if (email !== user.email) {
      const { error } = await supabase.auth.updateUser({ email });

      if (error) {
        setErrorMessage(error.message);
        setSaving(false);
        return;
      }
    }

    if (password.trim() !== "") {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setSaving(false);
        return;
      }

      setPassword("");
    }

    setMessage("Profile updated successfully.");
    setSaving(false);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#D4E0DF] flex items-center justify-center">
        <p className="text-[#476973] font-semibold">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#D4E0DF] flex flex-col">
      <section className="flex-1 px-6 pt-12 pb-10">
        <header className="mb-8 text-center">
          <h1 className="font-serif text-5xl text-[#476973]">
            Profile
          </h1>

          <p className="mt-3 text-[#476973]/75">
            Manage your personal information and account settings.
          </p>
        </header>

        <div className="rounded-[36px] bg-[#F8FBFA] p-6 shadow-sm">
          <div className="space-y-5">
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
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-[#476973] outline-none placeholder:text-[#476973]/45"
              />
            </div>
          </div>

          {message && (
            <p className="mt-5 rounded-2xl bg-green-50 p-3 text-center text-sm font-medium text-green-700">
              {message}
            </p>
          )}

          {errorMessage && (
            <p className="mt-5 rounded-2xl bg-red-50 p-3 text-center text-sm font-medium text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#476973] py-4 font-semibold text-white transition disabled:opacity-70"
          >
            <Save size={20} />
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#476973] py-4 font-semibold text-[#476973] transition disabled:opacity-70"
          >
            <LogOut size={20} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </section>

      <BottomNavigation />
    </main>
  );
}