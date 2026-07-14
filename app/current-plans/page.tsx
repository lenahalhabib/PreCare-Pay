"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  MoreVertical,
  ShieldCheck,
  Star,
  Trash2,
  Trophy,
  Wallet,
  X,
} from "lucide-react";

import { planService } from "@/services/plan/plan.service";
import type { TreatmentPlan } from "@/services/plan/plan.types";
import BottomNavigation from "@/shared/components/navigation/BottomNavigation";

export default function CurrentPlansPage() {
  const router = useRouter();

  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [openedMenuId, setOpenedMenuId] = useState<string | null>(
    null
  );

  const [planToDelete, setPlanToDelete] =
    useState<TreatmentPlan | null>(null);

  const [deletingPlanId, setDeletingPlanId] = useState<
    string | null
  >(null);

  const [deleteErrorMessage, setDeleteErrorMessage] =
    useState("");

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await planService.getCurrentUserPlans();

      setPlans(data);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load treatment plans."
      );
    } finally {
      setLoading(false);
    }
  }

  function openDeleteDialog(plan: TreatmentPlan) {
    setOpenedMenuId(null);
    setDeleteErrorMessage("");
    setPlanToDelete(plan);
  }

  function closeDeleteDialog() {
    if (deletingPlanId) {
      return;
    }

    setPlanToDelete(null);
    setDeleteErrorMessage("");
  }

  async function handleDeletePlan() {
    if (!planToDelete) {
      return;
    }

    try {
      setDeletingPlanId(planToDelete.id);
      setDeleteErrorMessage("");

      await planService.deletePlan(planToDelete.id);

      setPlans((currentPlans) =>
        currentPlans.filter(
          (plan) => plan.id !== planToDelete.id
        )
      );

      setPlanToDelete(null);
    } catch (error) {
      console.error(error);

      setDeleteErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete the treatment plan."
      );
    } finally {
      setDeletingPlanId(null);
    }
  }

  return (
    <main
      className="relative flex min-h-screen flex-col bg-[#D4E0DF]"
      onClick={() => setOpenedMenuId(null)}
    >
      <div className="absolute right-0 top-0 h-64 w-64 rounded-bl-full bg-[#365863]" />

      <section className="relative z-10 flex-1 px-6 pb-10 pt-24">
        <div className="mx-auto mb-12 w-fit rounded-full bg-[#EEF4F3] px-12 py-4 shadow-sm">
          <h1 className="font-serif text-4xl text-[#365863]">
            Current Plans
          </h1>
        </div>

        {loading ? (
          <div className="rounded-[32px] border border-white bg-[#F8FBFA] p-8 text-center shadow-md">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#D4E0DF] border-t-[#365863]" />

            <p className="text-lg text-[#365863]">
              Loading plans...
            </p>
          </div>
        ) : errorMessage ? (
          <div className="rounded-[32px] border border-white bg-[#F8FBFA] p-8 text-center shadow-md">
            <h2 className="font-serif text-3xl text-[#365863]">
              Unable to Load Plans
            </h2>

            <p className="mt-4 text-[#365863]">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={loadPlans}
              className="mt-8 w-full rounded-3xl bg-[#365863] py-4 font-serif text-xl text-white transition hover:bg-[#2F4F59]"
            >
              Try Again
            </button>
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-[32px] border border-white bg-[#F8FBFA] p-8 text-center shadow-md">
            <h2 className="font-serif text-3xl text-[#365863]">
              No Saved Plans
            </h2>

            <p className="mt-4 text-[#365863]">
              You don&apos;t have any saved treatment plans yet.
            </p>

            <button
              type="button"
              onClick={() => router.push("/create-plan")}
              className="mt-8 w-full rounded-3xl bg-[#365863] py-4 font-serif text-xl text-white transition hover:bg-[#2F4F59]"
            >
              Create Plan
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {plans.map((plan, index) => {
              const items = plan.treatment_plan_items ?? [];

              const bestHospital =
                plan.plan_hospital_results?.find(
                  (result) => result.is_best_option
                );

              const savings = Number(
                bestHospital?.savings ?? 0
              );

              const isMenuOpened =
                openedMenuId === plan.id;

              return (
                <article
                  key={plan.id}
                  className="relative rounded-[32px] border border-white bg-[#F8FBFA] p-7 shadow-md"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="absolute right-4 top-4 z-30">
                    <button
                      type="button"
                      aria-label="Open plan options"
                      onClick={() =>
                        setOpenedMenuId((currentId) =>
                          currentId === plan.id
                            ? null
                            : plan.id
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#365863] shadow-sm transition hover:bg-white"
                    >
                      <MoreVertical size={21} />
                    </button>

                    {isMenuOpened && (
                      <div className="absolute right-0 top-12 w-44 overflow-hidden rounded-2xl border border-[#D4E0DF] bg-white shadow-xl">
                        <button
                          type="button"
                          onClick={() =>
                            openDeleteDialog(plan)
                          }
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                          Delete Plan
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mb-7 rounded-3xl bg-[#365863] px-12 py-5 text-center">
                    <h2 className="font-serif text-3xl text-white">
                      {plan.title ||
                        `Plan ${String.fromCharCode(
                          65 + index
                        )}`}
                    </h2>

                    {plan.created_at && (
                      <p className="mt-2 text-sm text-white/75">
                        {new Date(
                          plan.created_at
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl text-[#365863]">
                      Treatment Details
                    </h3>

                    <div className="mt-4 space-y-3">
                      {items.length === 0 ? (
                        <p className="text-center text-[#365863]/70">
                          No services added.
                        </p>
                      ) : (
                        items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start justify-between gap-4 text-[#365863]"
                          >
                            <div>
                              <p className="text-[18px] leading-6">
                                {item.service_name}
                              </p>

                              {item.quantity > 1 && (
                                <p className="mt-1 text-sm text-[#365863]/60">
                                  Quantity: {item.quantity}
                                </p>
                              )}
                            </div>

                            <p className="whitespace-nowrap text-[18px] font-bold">
                              {Number(
                                item.total_price
                              ).toLocaleString()}{" "}
                              SAR
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="my-6 h-px bg-[#C8D2D0]" />

                    <div className="flex justify-between gap-4 text-[#365863]">
                      <p className="text-xl font-bold">
                        Original Plan Total
                      </p>

                      <p className="text-xl font-bold">
                        {Number(
                          plan.total_amount
                        ).toLocaleString()}{" "}
                        SAR
                      </p>
                    </div>
                  </div>

                  {bestHospital ? (
                    <div className="mt-8 overflow-hidden rounded-[30px] bg-[#E4ECEA] text-[#365863]">
                      <div className="bg-[#365863] px-5 py-6 text-center text-white">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
                          <Trophy size={28} />
                        </div>

                        <p className="mt-3 text-sm text-white/75">
                          Best Hospital
                        </p>

                        <h3 className="mt-1 font-serif text-3xl">
                          {bestHospital.hospital_name}
                        </h3>

                        {bestHospital.location && (
                          <p className="mt-3 flex items-center justify-center gap-2 text-sm text-white/80">
                            <MapPin size={16} />
                            {bestHospital.location}
                          </p>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="rounded-2xl bg-white p-3">
                            <Star
                              size={18}
                              className="mx-auto"
                            />

                            <p className="mt-1 font-bold">
                              {bestHospital.rating ?? "-"}
                            </p>

                            <p className="text-xs text-[#365863]/60">
                              Rating
                            </p>
                          </div>

                          <div className="rounded-2xl bg-white p-3">
                            <ShieldCheck
                              size={18}
                              className="mx-auto"
                            />

                            <p className="mt-1 font-bold">
                              {bestHospital.guarantee_days ??
                                0}{" "}
                              days
                            </p>

                            <p className="text-xs text-[#365863]/60">
                              Guarantee
                            </p>
                          </div>

                          <div className="rounded-2xl bg-white p-3">
                            <p className="font-bold">
                              {bestHospital.duration_days} days
                            </p>

                            <p className="mt-1 text-xs text-[#365863]/60">
                              Duration
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 rounded-2xl bg-white p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm text-[#365863]/65">
                                Hospital Total
                              </p>

                              <p className="mt-1 text-2xl font-bold">
                                {Number(
                                  bestHospital.total_price
                                ).toLocaleString()}{" "}
                                SAR
                              </p>
                            </div>

                            <Wallet size={28} />
                          </div>
                        </div>

                        <div className="mt-4 rounded-2xl bg-white p-4">
                          <p className="text-sm text-[#365863]/65">
                            {savings >= 0
                              ? "Estimated Savings"
                              : "Additional Cost"}
                          </p>

                          <p className="mt-1 text-xl font-bold">
                            {Math.abs(
                              savings
                            ).toLocaleString()}{" "}
                            SAR
                          </p>
                        </div>

                        {(bestHospital.recommendation_reason ||
                          plan.best_option_reason) && (
                          <div className="mt-4 rounded-2xl bg-white p-4">
                            <h4 className="font-serif text-xl">
                              Why this hospital?
                            </h4>

                            <p
                              dir="rtl"
                              className="mt-2 text-right leading-7 text-[#365863]/80"
                            >
                              {bestHospital.recommendation_reason ||
                                plan.best_option_reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-7 rounded-3xl bg-yellow-50 p-5 text-center text-yellow-800">
                      Hospital information is not available
                      for this plan.
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <BottomNavigation />

      {planToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D3339]/50 px-6 backdrop-blur-sm"
          onClick={closeDeleteDialog}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-plan-title"
            className="relative w-full max-w-sm rounded-[32px] bg-[#F8FBFA] p-7 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close delete confirmation"
              onClick={closeDeleteDialog}
              disabled={Boolean(deletingPlanId)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#E4ECEA] text-[#365863] transition hover:bg-[#D4E0DF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={18} />
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={28} />
            </div>

            <h2
              id="delete-plan-title"
              className="mt-5 font-serif text-3xl text-[#365863]"
            >
              Delete this plan?
            </h2>

            <p className="mt-3 leading-6 text-[#365863]/70">
              This will permanently delete{" "}
              <span className="font-semibold text-[#365863]">
                {planToDelete.title || "this treatment plan"}
              </span>
              . This action cannot be undone.
            </p>

            {deleteErrorMessage && (
              <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {deleteErrorMessage}
              </div>
            )}

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={closeDeleteDialog}
                disabled={Boolean(deletingPlanId)}
                className="rounded-2xl border border-[#C8D2D0] bg-white py-3 font-semibold text-[#365863] transition hover:bg-[#EEF4F3] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeletePlan}
                disabled={Boolean(deletingPlanId)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deletingPlanId ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}