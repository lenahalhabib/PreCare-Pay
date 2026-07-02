import Link from "next/link";
import { treatmentPlan } from "@/mock/treatmentPlan";
import BottomNavigation from "@/shared/components/navigation/BottomNavigation";

export default function ReviewPlanPage() {
  return (
    <main className="min-h-screen bg-[#D4E0DF] flex flex-col">

      <header className="pt-12 text-center">
        <h1 className="text-4xl font-serif text-[#476973]">
          Treatment Plan Review
        </h1>
      </header>

      <section className="flex-1 flex items-center justify-center px-8">

        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">

          <h2 className="text-2xl font-semibold text-[#476973] mb-8">
            Extracted Information
          </h2>

          <div className="space-y-6 text-[#476973]">

            <div>
              <p className="text-sm text-gray-500">Patient</p>
              <p className="font-semibold">{treatmentPlan.patientName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Procedure</p>
              <p className="font-semibold">{treatmentPlan.procedure}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Estimated Cost</p>
              <p className="font-semibold">{treatmentPlan.estimatedCost}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Insurance</p>
              <p className="font-semibold">{treatmentPlan.insurance}</p>
            </div>

          </div>

          <Link
            href="/hospital-comparison"
            className="mt-10 block w-full rounded-2xl bg-[#476973] py-4 text-center text-white font-semibold"
          >
            Continue
          </Link>

        </div>

      </section>

      <BottomNavigation />

    </main>
  );
}