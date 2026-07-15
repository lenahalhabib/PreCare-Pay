import {
  calculateCompletenessScore,
  calculateCostScores,
  calculateFinalScore,
  calculateInsuranceDetails,
  calculateInsuranceOptions,
  calculateQualityScore,
} from "./hospitalScoring";

import type {
  InsuranceOption,
} from "./hospitalScoring";

export type ServiceCategory =
  | "DIAGNOSTIC"
  | "PREVENTIVE"
  | "BASIC_TREATMENT"
  | "ADVANCED_TREATMENT"
  | "ORTHODONTICS"
  | "COSMETIC"
  | "FOLLOW_UP"
  | "TEMPORARY";

export type TreatmentItem = {
  serviceName: string;
  quantity: number;
  totalPrice?: number;
};

export type Hospital = {
  id: string;
  name: string;
  location: string;
  rating: number;
  accreditation: string;
  guarantee_days: number;
};

export type HospitalService = {
  id: string;
  hospital_id: string;
  service_code: string;
  service_name: string;
  price: number;
  duration_days: number;
};

export type ServiceKeyword = {
  id: string;
  service_code: string;
  keyword: string;
};

export type ServiceDefinition = {
  service_code: string;
  display_name: string;
  category: ServiceCategory;
};

export type InsuranceCompany = {
  id: string;
  company_code: string;
  name: string;
  plan_type:
    | "BASIC"
    | "PLUS"
    | "PREMIUM";
};

export type InsuranceCoverage = {
  id: string;
  insurance_company_id: string;
  category: ServiceCategory;
  coverage_percentage: number;
};

export type MatchedItem = {
  originalName: string;
  serviceCode: string;
  serviceName: string;
  category: ServiceCategory;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  durationDays: number;
};

export type ComparisonResult = {
  hospital: Hospital;

  total: number;
  savings: number;
  duration: number;

  matchedServices: number;
  matchedItems: MatchedItem[];
  unmatchedItems: string[];

  completenessScore: number;
  costScore: number;
  qualityScore: number;

  insuranceCompatibility: number;
  insuranceCoveredAmount: number;
  patientAmount: number;

  insuranceOptions: InsuranceOption[];

  finalScore: number;
};

function normalizeText(
  value: string
): string {
  return value
    .toLowerCase()
    .trim();
}

function findServiceCode(
  itemName: string,
  keywords: ServiceKeyword[]
): string | null {
  const cleanItemName =
    normalizeText(itemName);

  const matchedKeyword =
    keywords.find((keyword) => {
      const cleanKeyword =
        normalizeText(keyword.keyword);

      return (
        cleanItemName.includes(
          cleanKeyword
        ) ||
        cleanKeyword.includes(
          cleanItemName
        )
      );
    });

  return (
    matchedKeyword?.service_code ??
    null
  );
}

export function buildHospitalComparison(
  params: {
    hospitals: Hospital[];
    services: HospitalService[];
    keywords: ServiceKeyword[];
    serviceDefinitions:
      ServiceDefinition[];

    insuranceCompanies:
      InsuranceCompany[];

    insuranceCoverage:
      InsuranceCoverage[];

    selectedInsuranceCompanyId:
      string | null;

    items: TreatmentItem[];
    currentTotal: number;
  }
): ComparisonResult[] {
  const {
    hospitals,
    services,
    keywords,
    serviceDefinitions,
    insuranceCompanies,
    insuranceCoverage,
    selectedInsuranceCompanyId,
    items,
    currentTotal,
  } = params;

  const baseResults:
    ComparisonResult[] =
    hospitals
      .map((hospital) => {
        const hospitalServices =
          services.filter(
            (service) =>
              service.hospital_id ===
              hospital.id
          );

        const matchedItems:
          MatchedItem[] = [];

        const unmatchedItems:
          string[] = [];

        let total = 0;
        let duration = 0;

        items.forEach((item) => {
          const itemName =
            item.serviceName || "";

          const quantity =
            Number(
              item.quantity || 1
            );

          const serviceCode =
            findServiceCode(
              itemName,
              keywords
            );

          if (!serviceCode) {
            unmatchedItems.push(
              itemName
            );

            return;
          }

          const matchedService =
            hospitalServices.find(
              (service) =>
                service.service_code ===
                serviceCode
            );

          if (!matchedService) {
            unmatchedItems.push(
              itemName
            );

            return;
          }

          const serviceDefinition =
            serviceDefinitions.find(
              (service) =>
                service.service_code ===
                serviceCode
            );

          if (!serviceDefinition) {
            unmatchedItems.push(
              itemName
            );

            return;
          }

          const unitPrice =
            Number(
              matchedService.price
            );

          const itemTotal =
            unitPrice * quantity;

          const itemDuration =
            Number(
              matchedService
                .duration_days || 1
            );

          matchedItems.push({
            originalName: itemName,
            serviceCode,
            serviceName:
              matchedService.service_name,
            category:
              serviceDefinition.category,
            quantity,
            unitPrice,
            totalPrice: itemTotal,
            durationDays:
              itemDuration,
          });

          total += itemTotal;
          duration += itemDuration;
        });

        const completenessScore =
          calculateCompletenessScore(
            matchedItems.length,
            items.length
          );

        const qualityScore =
          calculateQualityScore(
            hospital.rating
          );

        const insuranceDetails =
          calculateInsuranceDetails({
            matchedItems,
            insuranceCoverage,
            insuranceCompanyId:
              selectedInsuranceCompanyId,
          });

        const insuranceOptions =
          calculateInsuranceOptions({
            matchedItems,
            insuranceCompanies,
            insuranceCoverage,
          });

        return {
          hospital,

          total,

          savings:
            Number(
              currentTotal || 0
            ) - total,

          duration,

          matchedServices:
            matchedItems.length,

          matchedItems,
          unmatchedItems,

          completenessScore,

          costScore: 0,

          qualityScore,

          insuranceCompatibility:
            insuranceDetails
              .insuranceCompatibility,

          insuranceCoveredAmount:
            insuranceDetails
              .insuranceCoveredAmount,

          patientAmount:
            insuranceDetails
              .patientAmount,

          insuranceOptions,

          finalScore: 0,
        };
      })
      .filter(
        (result) =>
          result.matchedServices > 0
      );

  const costScores =
    calculateCostScores(
      baseResults
    );

  return baseResults
    .map((result) => {
      const costScore =
        costScores.get(
          result.hospital.id
        ) ?? 0;

      const finalScore =
        calculateFinalScore({
          completenessScore:
            result.completenessScore,

          costScore,

          qualityScore:
            result.qualityScore,

          insuranceCompatibility:
            result.insuranceCompatibility,
        });

      return {
        ...result,
        costScore,
        finalScore,
      };
    })
    .sort(
      (
        firstResult,
        secondResult
      ) =>
        secondResult.finalScore -
        firstResult.finalScore
    );
}