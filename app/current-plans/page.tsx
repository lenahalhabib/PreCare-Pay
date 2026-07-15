"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import BottomNavigation from "@/shared/components/navigation/BottomNavigation";

import {
  planService,
} from "@/services/plan/plan.service";

import type {
  TreatmentPlan,
} from "@/services/plan/plan.types";

import CurrentPlanCard from "./components/CurrentPlanCard";
import DeletePlanDialog from "./components/DeletePlanDialog";

export default function CurrentPlansPage() {
  const router = useRouter();

  const [
    plans,
    setPlans,
  ] = useState<TreatmentPlan[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    planToDelete,
    setPlanToDelete,
  ] = useState<TreatmentPlan | null>(
    null
  );

  const [
    deletingPlanId,
    setDeletingPlanId,
  ] = useState<string | null>(null);

  const [
    deleteErrorMessage,
    setDeleteErrorMessage,
  ] = useState("");

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    try {
      setLoading(true);
      setErrorMessage("");

      const data =
        await planService
          .getCurrentUserPlans();

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

  function openDeleteDialog(
    plan: TreatmentPlan
  ) {
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
      setDeletingPlanId(
        planToDelete.id
      );

      setDeleteErrorMessage("");

      await planService.deletePlan(
        planToDelete.id
      );

      setPlans((currentPlans) =>
        currentPlans.filter(
          (plan) =>
            plan.id !==
            planToDelete.id
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
    <main className="relative flex min-h-screen flex-col bg-[#D4E0DF]">
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
              You don&apos;t have any saved
              treatment plans yet.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/create-plan"
                )
              }
              className="mt-8 w-full rounded-3xl bg-[#365863] py-4 font-serif text-xl text-white transition hover:bg-[#2F4F59]"
            >
              Create Plan
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {plans.map(
              (plan, index) => (
                <CurrentPlanCard
                  key={plan.id}
                  plan={plan}
                  fallbackTitle={`Plan ${String.fromCharCode(
                    65 + index
                  )}`}
                  onDelete={() =>
                    openDeleteDialog(
                      plan
                    )
                  }
                />
              )
            )}
          </div>
        )}
      </section>

      <BottomNavigation />

      <DeletePlanDialog
        plan={planToDelete}
        deleting={Boolean(
          deletingPlanId
        )}
        errorMessage={
          deleteErrorMessage
        }
        onCancel={
          closeDeleteDialog
        }
        onConfirm={
          handleDeletePlan
        }
      />
    </main>
  );
}