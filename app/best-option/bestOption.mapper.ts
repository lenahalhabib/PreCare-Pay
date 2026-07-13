import type { ExtractedPlanItem } from "@/shared/context/TreatmentContext";
import type { SaveTreatmentPlanInput } from "@/services/plan/plan.types";
import {
  buildHospitalComparison,
} from "@/shared/utils/hospitalComparison";

export type ComparisonResult =
  ReturnType<typeof buildHospitalComparison>[number];

type BuildSavePlanInputParams = {
  extractedText: string;
  totalAmount: number;
  items: ExtractedPlanItem[];
  comparisonResults: ComparisonResult[];
};

export function createRecommendationReason(
  bestOption: ComparisonResult,
  totalItems: number
): string {
  const priceDifference = Math.abs(bestOption.savings);

  let priceMessage: string;

  if (bestOption.savings > 0) {
    priceMessage = `ويوفر ${priceDifference.toLocaleString()} ريال مقارنة بخطتك الحالية`;
  } else if (bestOption.savings < 0) {
    priceMessage = `وتكلفته أعلى من خطتك الحالية بمقدار ${priceDifference.toLocaleString()} ريال`;
  } else {
    priceMessage = "وتكلفته مساوية لتكلفة خطتك الحالية";
  }

  return `نوصي بـ ${bestOption.hospital.name} لأنه يقدم أفضل خيار بناءً على خطة العلاج الحالية. تمت مطابقة ${bestOption.matchedServices} من أصل ${totalItems} خدمات علاجية، مع تكلفة تقديرية قدرها ${bestOption.total.toLocaleString()} ريال، ${priceMessage}، بالإضافة إلى تقييم ${bestOption.hospital.rating} وضمان علاجي لمدة ${bestOption.hospital.guarantee_days} يوم.`;
}

export function buildSaveTreatmentPlanInput({
  extractedText,
  totalAmount,
  items,
  comparisonResults,
}: BuildSavePlanInputParams): SaveTreatmentPlanInput {
  const bestOption = comparisonResults[0];

  if (!bestOption) {
    throw new Error("Best hospital option is missing");
  }

  const recommendationReason =
    createRecommendationReason(
      bestOption,
      items.length
    );

  return {
    title: `Treatment Plan - ${new Date().toLocaleDateString(
      "en-GB"
    )}`,

    originalFileName: null,
    extractedText,
    totalAmount: Number(totalAmount || 0),

    items: items.map((item) => ({
      service_name: item.serviceName,
      quantity: Number(item.quantity || 1),
      unit_price: Number(item.unitPrice || 0),
      total_price: Number(item.totalPrice || 0),
    })),

    hospitalResults: comparisonResults.map(
      (result, index) => ({
        hospital_id: result.hospital.id,
        hospital_name: result.hospital.name,
        location:
          result.hospital.location ?? null,
        accreditation:
          result.hospital.accreditation ?? null,

        rating:
          result.hospital.rating === null ||
          result.hospital.rating === undefined
            ? null
            : Number(result.hospital.rating),

        guarantee_days:
          result.hospital.guarantee_days === null ||
          result.hospital.guarantee_days === undefined
            ? null
            : Number(
                result.hospital.guarantee_days
              ),

        total_price: Number(result.total || 0),
        savings: Number(result.savings || 0),

        duration_days: Number(
          result.duration || 0
        ),

        matched_services_count: Number(
          result.matchedServices || 0
        ),

        total_services_count: items.length,

        score: null,
        ranking: index + 1,
        is_best_option: index === 0,

        recommendation_reason:
          index === 0
            ? recommendationReason
            : null,

        service_breakdown:
          result.matchedItems.map(
            (matchedItem) => ({
              service_name:
                matchedItem.originalName,

              matched_service_name:
                matchedItem.serviceCode,

              quantity:
                matchedItem.quantity,

              unit_price:
                matchedItem.unitPrice,

              total_price:
                matchedItem.totalPrice,

              matched: true,
            })
          ),

        score_breakdown: {},
      })
    ),

    bestHospitalId:
      bestOption.hospital.id,

    bestHospitalName:
      bestOption.hospital.name,

    bestOptionReason:
      recommendationReason,

    analysisVersion: "v1",
  };
}