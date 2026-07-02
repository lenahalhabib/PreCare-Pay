"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import BottomNavigation from "@/shared/components/navigation/BottomNavigation";

export default function ProfilePage() {

  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
  loadProfile();
}, []);

const loadProfile = async () => {
  setLoading(true);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    setLoading(false);
    return;
  }

  setEmail(user.email || "");

  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, national_id")
    .eq("id", user.id)
    .single();

  if (!error && data) {
    setFullName(data.full_name);
    setNationalId(data.national_id);
  }

  setLoading(false);
}
  const handleSave = async () => {
  setMessage("");
  setErrorMessage("");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      national_id: nationalId,
    })
    .eq("id", user.id);

  if (profileError) {
    setErrorMessage("Failed to update profile.");
    return;
  }

  if (email !== user.email) {
    const { error } = await supabase.auth.updateUser({
      email,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }
  }

  if (password.trim() !== "") {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setPassword("");
  }

  setMessage("Profile updated successfully.");
};

  return (
    <main className="min-h-screen bg-[#D4E0DF] flex flex-col">

      <header className="pt-12 text-center">
        <h1 className="text-4xl font-serif text-[#476973]">
          Profile
        </h1>
      </header>

      <section className="flex-1 flex justify-center px-6 py-8">

        <div className="w-full max-w-md bg-[#476973] rounded-3xl p-6 space-y-5 shadow-lg">

          <div>
            <label className="text-white font-semibold">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2 w-full rounded-xl bg-white p-4 outline-none"
            />
          </div>

          <div>
            <label className="text-white font-semibold">
              National ID
            </label>
            <input
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="mt-2 w-full rounded-xl bg-white p-4 outline-none"
            />
          </div>

          <div>
            <label className="text-white font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl bg-white p-4 outline-none"
            />
          </div>

          <div>
            <label className="text-white font-semibold">
              New Password
            </label>
            <input
              type="password"
              placeholder="Leave empty if you don't want to change it"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl bg-white p-4 outline-none"
            />
          </div>

          {message && (
            <div className="bg-green-100 text-green-700 rounded-xl p-3 text-center text-sm">
              {message}
            </div>
          )}


{errorMessage && (
  <div className="bg-red-100 text-red-700 rounded-xl p-3 text-center text-sm">
    {errorMessage}
  </div>
)}
          <button
            onClick={handleSave}
            className="w-full bg-white text-[#476973] font-bold py-4 rounded-xl hover:bg-gray-100 transition"
          >
            Save Changes
          </button>

        </div>

      </section>

      <BottomNavigation />

    </main>
  );
}