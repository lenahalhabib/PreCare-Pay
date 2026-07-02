"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNavigation from "@/shared/components/navigation/BottomNavigation";

export default function CreatePlanPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/extract-plan", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("API Response:", data);

      if (!response.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      router.push("/review-plan");
    } catch (error) {
      console.error(error);
      alert("Failed to analyze the file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#D4E0DF] flex flex-col">
      <header className="pt-12 text-center">
        <h1 className="text-4xl font-serif text-[#476973]">
          Create Plan
        </h1>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-full max-w-sm rounded-3xl border-2 border-dashed border-[#476973] p-10 text-center">
          <p className="text-[#476973] font-semibold">
            Upload your treatment plan
          </p>

          <input
            id="upload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(event) => {
              if (event.target.files && event.target.files.length > 0) {
                setSelectedFile(event.target.files[0]);
              }
            }}
          />

          <label
            htmlFor="upload"
            className="mt-8 inline-block cursor-pointer rounded-2xl bg-[#476973] px-8 py-3 text-white"
          >
            Upload File
          </label>

          {selectedFile && (
            <div className="mt-6">
              <p className="text-green-600 font-semibold">
                ✅ {selectedFile.name}
              </p>

              <p className="text-sm text-[#476973]">
                Uploaded Successfully
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!selectedFile || loading}
          className={`mt-10 w-full max-w-sm rounded-2xl py-4 font-semibold text-white transition ${
            selectedFile
              ? "bg-[#476973] hover:opacity-90"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </section>

      <BottomNavigation />
    </main>
  );
}