"use client";

import { useRouter } from "next/navigation";
import BottomNavigation from "@/shared/components/navigation/BottomNavigation";

export default function HospitalRecommendationPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#D4E0DF] flex flex-col">
      <section className="flex-1 px-6 pt-12 pb-10">
        <header className="mb-8 text-center">
          <h1 className="font-serif text-4xl text-[#476973]">
            Recommendation
          </h1>

          <p className="mt-3 text-[#476973]/75">
            Your best option will appear here after hospital comparison.
          </p>
        </header>

        <div className="rounded-[36px] bg-[#F8FBFA] p-6 text-center shadow-sm">
          <h2 className="font-serif text-3xl text-[#476973]">
            Coming Soon
          </h2>

          <p className="mt-4 text-[#476973]/75">
            The AI recommendation engine will be added in the next step.
          </p>

          <button
            onClick={() => router.push("/hospital/comparison")}
            className="mt-8 w-full rounded-2xl bg-[#476973] py-4 font-semibold text-white"
          >
            Back to Comparison
          </button>
        </div>
      </section>

      <BottomNavigation />
    </main>
  );
}