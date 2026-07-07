"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, Pencil, ArrowRight } from "lucide-react";
import BottomNavigation from "@/shared/components/navigation/BottomNavigation";
import { useTreatment } from "@/shared/context/TreatmentContext";

export default function ReviewPlanPage() {
  const router = useRouter();
  const { items, totalAmount, extractedText } = useTreatment();

  const hasItems = items.length > 0;

  return (
    <main className="min-h-screen bg-[#D4E0DF] flex flex-col">
      <section className="flex-1 px-6 pt-12 pb-10">
        <header className="mb-8 text-center">
          <h1 className="font-serif text-4xl text-[#476973]">
            Review Plan
          </h1>

          <p className="mt-3 text-[#476973]/75">
            Check the extracted treatment items before comparing hospitals.
          </p>
        </header>

        <div className="rounded-[36px] bg-[#F8FBFA] p-6 shadow-sm">
          <h2 className="font-serif text-3xl text-[#476973] text-center">
            Extracted Items
          </h2>

          {!hasItems ? (
            <div className="mt-8 rounded-3xl bg-white p-5 text-center">
              <p className="font-semibold text-[#476973]">
                No treatment items found.
              </p>

              {extractedText && (
                <p className="mt-3 text-sm text-[#476973]/70">
                  Text was extracted, but items were not structured correctly.
                </p>
              )}

              <button
                onClick={() => router.push("/create-plan")}
                className="mt-6 w-full rounded-2xl bg-[#476973] py-4 font-semibold text-white"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="mt-8 space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-3xl bg-white p-5 text-[#476973]"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle size={24} className="mt-1 text-[#476973]" />

                      <div className="flex-1">
                        <p className="text-lg font-bold">
                          {item.serviceName}
                        </p>

                        {item.toothNumber && (
                          <p className="mt-1 text-sm text-[#476973]/65">
                            Tooth: {item.toothNumber}
                          </p>
                        )}

                        <p className="mt-1 text-sm text-[#476973]/65">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="font-bold">
                        {Number(item.totalPrice).toLocaleString()} SAR
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl bg-[#476973] p-5 text-white">
                <div className="flex justify-between">
                  <p className="text-xl font-bold">Total</p>
                  <p className="text-xl font-bold">
                    {Number(totalAmount).toLocaleString()} SAR
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push("/create-plan")}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#476973] py-4 font-semibold text-[#476973]"
              >
                <Pencil size={20} />
                Edit / Upload Again
              </button>

              <button
                onClick={() => router.push("/hospital/comparison")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#476973] py-4 font-semibold text-white"
              >
                Compare Hospitals
                <ArrowRight size={20} />
              </button>
            </>
          )}
        </div>
      </section>

      <BottomNavigation />
    </main>
  );
}