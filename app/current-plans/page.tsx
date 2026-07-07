"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { planService, TreatmentPlan } from "@/services/plan/plan.service";
import BottomNavigation from "@/shared/components/navigation/BottomNavigation";

export default function CurrentPlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    try {
      const data = await planService.getCurrentUserPlans();
      setPlans(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#D4E0DF] flex flex-col relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#365863] rounded-bl-full" />

      <section className="relative z-10 flex-1 px-6 pt-24 pb-10">
        <div className="mx-auto mb-12 w-fit rounded-full bg-[#EEF4F3] px-12 py-4 shadow-sm">
          <h1 className="font-serif text-4xl text-[#365863]">
            Current Plan
          </h1>
        </div>

        {loading ? (
          <p className="text-center text-[#365863]">Loading...</p>
        ) : plans.length === 0 ? (
          <div className="rounded-[32px] bg-[#F8FBFA] p-8 text-center shadow-md border border-white">
            <h2 className="font-serif text-3xl text-[#365863]">No Plans</h2>

            <p className="mt-4 text-[#365863]">
              You don’t have any treatment plans yet.
            </p>

            <button
              onClick={() => router.push("/create-plan")}
              className="mt-8 w-full rounded-3xl bg-[#365863] py-4 font-serif text-xl text-white"
            >
              Create Plan
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className="rounded-[32px] bg-[#F8FBFA] p-7 shadow-md border border-white"
              >
                <div className="mb-8 rounded-3xl bg-[#365863] py-5 text-center">
                  <h2 className="font-serif text-3xl text-white">
                    {plan.title || `Plan ${String.fromCharCode(65 + index)}`}
                  </h2>
                </div>

                <div className="space-y-3">
                  {plan.plan_items.length === 0 ? (
                    <p className="text-center text-[#365863]">
                      No services added.
                    </p>
                  ) : (
                    plan.plan_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between gap-4 text-[#365863]"
                      >
                        <p className="text-[19px] leading-6">
                          {item.service_name}
                          {item.quantity > 1 ? ` (Qty ${item.quantity})` : ""}
                        </p>

                        <p className="whitespace-nowrap text-[19px] font-bold">
                          {Number(item.total_price).toLocaleString()} SAR
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="my-7 h-px bg-[#C8D2D0]" />

                <div className="flex justify-between text-[#365863]">
                  <p className="text-2xl font-bold">Total:</p>
                  <p className="text-2xl font-bold">
                    {Number(plan.total_amount).toLocaleString()} SAR
                  </p>
                </div>

                <button
                  onClick={() => router.push("/hospital/comparison")}
                  className="mt-8 w-full rounded-3xl border-2 border-[#365863] py-4 font-serif text-xl text-[#365863]"
                >
                  Hospital Comparison
                </button>

                <button
                  onClick={() => router.push("/create-plan")}
                  className="mt-5 w-full rounded-3xl border-2 border-[#365863] py-4 font-serif text-xl text-[#365863]"
                >
                  Generate Plan B
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <BottomNavigation />
    </main>
  );
}