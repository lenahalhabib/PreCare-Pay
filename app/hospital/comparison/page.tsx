"use client";

import { useRouter } from "next/navigation";
import BottomNavigation from "@/shared/components/navigation/BottomNavigation";

export default function HospitalComparisonPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#D4E0DF] flex flex-col">
      <section className="flex-1 px-6 pt-12 pb-10">
        <header className="mb-8 text-center">
          <h1 className="font-serif text-4xl text-[#476973]">
            Hospital Comparison
          </h1>

          <p className="mt-3 text-[#476973]/75">
            Hospital comparison will be available in the next step.
          </p>
        </header>

        <div className="rounded-[36px] bg-[#F8FBFA] p-6 text-center shadow-sm">
          <h2 className="font-serif text-3xl text-[#476973]">
            Coming Soon
          </h2>

          <p className="mt-4 text-[#476973]/75">
            We will compare hospitals based on price, insurance, rating, and
            value.
          </p>

          <button
            onClick={() => router.push("/review-plan")}
            className="mt-8 w-full rounded-2xl bg-[#476973] py-4 font-semibold text-white"
          >
            Back to Review
          </button>
        </div>
      </section>

      <BottomNavigation />
    </main>
  );
}