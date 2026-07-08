"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Wallet,
} from "lucide-react";
import BottomNavigation from "@/shared/components/navigation/BottomNavigation";
import { supabase } from "@/lib/supabase";
import { useTreatment } from "@/shared/context/TreatmentContext";
import {
  buildHospitalComparison,
  Hospital,
  HospitalService,
  ServiceKeyword,
} from "@/shared/utils/hospitalComparison";

export default function BestOptionPage() {
  const router = useRouter();
  const { items, totalAmount } = useTreatment();

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [services, setServices] = useState<HospitalService[]>([]);
  const [keywords, setKeywords] = useState<ServiceKeyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadBestOptionData();
  }, []);

  async function loadBestOptionData() {
    try {
      setLoading(true);
      setErrorMessage("");

      const { data: hospitalsData, error: hospitalsError } = await supabase
        .from("hospitals")
        .select("*");

      if (hospitalsError) throw hospitalsError;

      const { data: servicesData, error: servicesError } = await supabase
        .from("hospital_services")
        .select("*");

      if (servicesError) throw servicesError;

      const { data: keywordsData, error: keywordsError } = await supabase
        .from("service_keywords")
        .select("*");

      if (keywordsError) throw keywordsError;

      setHospitals(hospitalsData || []);
      setServices(servicesData || []);
      setKeywords(keywordsData || []);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to load best option.");
    } finally {
      setLoading(false);
    }
  }

  const comparisonResults = useMemo(() => {
    return buildHospitalComparison({
      hospitals,
      services,
      keywords,
      items,
      currentTotal: Number(totalAmount || 0),
    });
  }, [hospitals, services, keywords, items, totalAmount]);

  const bestOption = comparisonResults[0];

  const confidence = bestOption
    ? Math.round((bestOption.matchedServices / items.length) * 100)
    : 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#D4E0DF] flex items-center justify-center px-6">
        <div className="rounded-[30px] bg-[#F8FBFA] p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#D4E0DF] border-t-[#476973]" />
          <p className="font-semibold text-[#476973]">
            Preparing best option...
          </p>
          <p className="mt-2 text-sm text-[#476973]/70">
            Comparing price, rating, guarantee, and matched services.
          </p>
        </div>
      </main>
    );
  }

  if (!bestOption) {
    return (
      <main className="min-h-screen bg-[#D4E0DF] flex flex-col">
        <section className="flex-1 px-6 pt-12 pb-10">
          <div className="rounded-[36px] bg-[#F8FBFA] p-6 text-center shadow-sm">
            <h1 className="font-serif text-4xl text-[#476973]">
              Best Option
            </h1>

            <p className="mt-4 text-[#476973]/75">
              We could not generate a recommendation because no hospital matches
              were found.
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

  return (
    <main className="min-h-screen bg-[#D4E0DF] flex flex-col">
      <section className="flex-1 px-6 pt-12 pb-10">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F8FBFA]">
            <Trophy size={34} className="text-[#476973]" />
          </div>

          <h1 className="font-serif text-5xl text-[#476973]">Best Option</h1>

          <p className="mt-3 text-[#476973]/75">
            Based on your treatment plan and our hospital comparison.
          </p>
        </header>

        {errorMessage && (
          <p className="mb-5 rounded-2xl bg-red-50 p-3 text-center text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        <div className="rounded-[36px] bg-[#476973] p-6 text-center text-white shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
            <Sparkles size={28} />
          </div>

          <p className="text-sm opacity-80">Recommended Hospital</p>

          <h2 className="mt-2 font-serif text-4xl">
            {bestOption.hospital.name}
          </h2>

          <p className="mt-2 flex items-center justify-center gap-2 text-sm opacity-85">
            <MapPin size={16} />
            {bestOption.hospital.location}
          </p>

          <p className="mt-5 text-4xl font-bold">
            {bestOption.total.toLocaleString()} SAR
          </p>

          <span className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-bold text-[#476973]">
            Best Value
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-[26px] bg-[#F8FBFA] p-5 text-center shadow-sm">
            <Wallet size={24} className="mx-auto text-[#476973]" />
            <p className="mt-2 text-sm text-[#476973]/65">
              Estimated Savings
            </p>
            <p className="mt-1 text-xl font-bold text-[#476973]">
              {bestOption.savings > 0
                ? `${bestOption.savings.toLocaleString()} SAR`
                : "0 SAR"}
            </p>
          </div>

          <div className="rounded-[26px] bg-[#F8FBFA] p-5 text-center shadow-sm">
            <Star size={24} className="mx-auto text-[#476973]" />
            <p className="mt-2 text-sm text-[#476973]/65">Rating</p>
            <p className="mt-1 text-xl font-bold text-[#476973]">
              {bestOption.hospital.rating}
            </p>
          </div>

          <div className="rounded-[26px] bg-[#F8FBFA] p-5 text-center shadow-sm">
            <ShieldCheck size={24} className="mx-auto text-[#476973]" />
            <p className="mt-2 text-sm text-[#476973]/65">Guarantee</p>
            <p className="mt-1 text-xl font-bold text-[#476973]">
              {bestOption.hospital.guarantee_days} days
            </p>
          </div>

          <div className="rounded-[26px] bg-[#F8FBFA] p-5 text-center shadow-sm">
            <CheckCircle size={24} className="mx-auto text-[#476973]" />
            <p className="mt-2 text-sm text-[#476973]/65">Confidence</p>
            <p className="mt-1 text-xl font-bold text-[#476973]">
              {confidence}%
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[30px] bg-[#F8FBFA] p-5 shadow-sm">
          <h3 className="font-serif text-2xl text-[#476973]">
            Price Breakdown
          </h3>

          <div className="mt-4 space-y-3">
            {bestOption.matchedItems.map((item, index) => (
              <div
                key={`${item.serviceCode}-${index}`}
                className="flex justify-between gap-4 rounded-2xl bg-white p-4"
              >
                <div>
                  <p className="font-semibold text-[#476973]">
                    {item.originalName}
                  </p>
                  <p className="mt-1 text-xs text-[#476973]/60">
                    {item.unitPrice.toLocaleString()} SAR × {item.quantity}
                  </p>
                </div>

                <p className="font-bold text-[#476973]">
                  {item.totalPrice.toLocaleString()} SAR
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between rounded-2xl bg-[#476973] p-4 text-white">
            <p className="font-bold">Total</p>
            <p className="font-bold">
              {bestOption.total.toLocaleString()} SAR
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[30px] bg-[#F8FBFA] p-5 shadow-sm">
          <h3 className="font-serif text-2xl text-[#476973]">
            ✨ لماذا نوصي بهذا المستشفى؟
          </h3>

          <p className="mt-3 leading-7 text-[#476973]/80">
            نوصي بـ {bestOption.hospital.name} لأنه يقدم أفضل خيار بناءً على
            خطة علاجك الحالية، حيث تمكّن النظام من مطابقة{" "}
            {bestOption.matchedServices} من أصل {items.length} خدمات علاجية مع
            قاعدة بيانات الأسعار. كما أن التكلفة التقديرية أقل من خطتك الحالية
            بمقدار {bestOption.savings > 0 ? bestOption.savings.toLocaleString() : 0}{" "}
            ريال، مع تقييم جيد وضمان علاجي لمدة{" "}
            {bestOption.hospital.guarantee_days} يوم.
          </p>
        </div>

        {bestOption.unmatchedItems.length > 0 && (
          <div className="mt-5 rounded-[30px] bg-yellow-50 p-5 shadow-sm">
            <h3 className="font-semibold text-yellow-800">
              Services not matched
            </h3>

            <ul className="mt-3 space-y-1 text-sm text-yellow-800">
              {bestOption.unmatchedItems.map((item, index) => (
                <li key={`${item}-${index}`}>• {item}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={() => router.push("/hospital/comparison")}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#476973] py-4 font-semibold text-[#476973]"
        >
          <ArrowLeft size={20} />
          Back to Comparison
        </button>
      </section>

      <BottomNavigation />
    </main>
  );
}