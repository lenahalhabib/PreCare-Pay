import { supabase } from "@/lib/supabase";

export type PlanItem = {
  id: string;
  service_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type TreatmentPlan = {
  id: string;
  title: string;
  clinic_name: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  plan_items: PlanItem[];
};

export const planService = {
  async getCurrentUserPlans(): Promise<TreatmentPlan[]> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not logged in");
    }

    const { data, error } = await supabase
      .from("treatment_plans")
      .select(`
        id,
        title,
        clinic_name,
        total_amount,
        status,
        created_at,
        plan_items (
          id,
          service_name,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  },
};