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
};

export type ComparisonResult = {
  hospital: Hospital;

  total: number;

  savings: number;

  comparisonCost: number;

  matchedServices: number;
  matchedItems: MatchedItem[];
  unmatchedItems: string[];

  completenessScore: number;
  costScore: number;
  qualityScore: number;
  finalScore: number;

  insuranceCompatibility: number;
  insuranceCoveredAmount: number;
  patientAmount: number;

  insuranceOptions:
    InsuranceOption[];
};

type BuildHospitalComparisonParams = {
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
};

type ResolvedTreatmentItem = {
  originalName: string;
  quantity: number;
  originalTotal: number;

  serviceCode: string | null;
  category: ServiceCategory | null;
};

function toValidNumber(
  value: unknown
): number {
  const numericValue =
    Number(value);

  return Number.isFinite(
    numericValue
  )
    ? numericValue
    : 0;
}

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
  const normalizedItemName =
    normalizeText(itemName);

  if (!normalizedItemName) {
    return null;
  }

  const matchedKeyword =
    keywords.find((keyword) => {
      const normalizedKeyword =
        normalizeText(
          keyword.keyword
        );

      if (!normalizedKeyword) {
        return false;
      }

      return (
        normalizedItemName.includes(
          normalizedKeyword
        ) ||
        normalizedKeyword.includes(
          normalizedItemName
        )
      );
    });

  return (
    matchedKeyword?.service_code ??
    null
  );
}

function findServiceDefinition(
  serviceCode: string,
  serviceDefinitions:
    ServiceDefinition[]
): ServiceDefinition | undefined {
  return serviceDefinitions.find(
    (definition) =>
      definition.service_code ===
      serviceCode
  );
}

function findHospitalService(
  serviceCode: string,
  hospitalServices:
    HospitalService[]
): HospitalService | undefined {
  return hospitalServices.find(
    (service) =>
      service.service_code ===
      serviceCode
  );
}

function calculateMedian(
  values: number[]
): number {
  const validValues =
    values
      .filter(
        (value) =>
          Number.isFinite(value) &&
          value > 0
      )
      .sort(
        (first, second) =>
          first - second
      );

  if (validValues.length === 0) {
    return 0;
  }

  const middleIndex =
    Math.floor(
      validValues.length / 2
    );

  if (
    validValues.length % 2 === 1
  ) {
    return validValues[
      middleIndex
    ];
  }

  return (
    validValues[
      middleIndex - 1
    ] +
    validValues[
      middleIndex
    ]
  ) / 2;
}

function buildMedianPriceByServiceCode(
  services: HospitalService[]
): Map<string, number> {
  const groupedPrices =
    new Map<string, number[]>();

  services.forEach((service) => {
    const price =
      toValidNumber(service.price);

    if (price <= 0) {
      return;
    }

    const currentPrices =
      groupedPrices.get(
        service.service_code
      ) ?? [];

    currentPrices.push(price);

    groupedPrices.set(
      service.service_code,
      currentPrices
    );
  });

  const medians =
    new Map<string, number>();

  groupedPrices.forEach(
    (prices, serviceCode) => {
      medians.set(
        serviceCode,
        calculateMedian(prices)
      );
    }
  );

  return medians;
}

function resolveTreatmentItems(
  items: TreatmentItem[],
  keywords: ServiceKeyword[],
  serviceDefinitions:
    ServiceDefinition[]
): ResolvedTreatmentItem[] {
  return items.map((item) => {
    const originalName =
      item.serviceName?.trim() || "";

    const quantity =
      Math.max(
        1,
        toValidNumber(
          item.quantity
        ) || 1
      );

    const originalTotal =
      Math.max(
        0,
        toValidNumber(
          item.totalPrice
        )
      );

    const serviceCode =
      findServiceCode(
        originalName,
        keywords
      );

    if (!serviceCode) {
      return {
        originalName,
        quantity,
        originalTotal,
        serviceCode: null,
        category: null,
      };
    }

    const definition =
      findServiceDefinition(
        serviceCode,
        serviceDefinitions
      );

    return {
      originalName,
      quantity,
      originalTotal,
      serviceCode,

      category:
        definition?.category ??
        null,
    };
  });
}

function getMissingServiceEstimate(
  item: ResolvedTreatmentItem,
  medianPrices:
    Map<string, number>
): number {
  if (item.serviceCode) {
    const medianUnitPrice =
      medianPrices.get(
        item.serviceCode
      ) ?? 0;

    if (medianUnitPrice > 0) {
      return (
        medianUnitPrice *
        item.quantity
      );
    }
  }

  return item.originalTotal;
}

function buildBaseHospitalResult(
  params: {
    hospital: Hospital;

    hospitalServices:
      HospitalService[];

    resolvedItems:
      ResolvedTreatmentItem[];

    medianPrices:
      Map<string, number>;

    insuranceCompanies:
      InsuranceCompany[];

    insuranceCoverage:
      InsuranceCoverage[];

    selectedInsuranceCompanyId:
      string | null;

    currentTotal: number;
  }
): ComparisonResult {
  const {
    hospital,
    hospitalServices,
    resolvedItems,
    medianPrices,
    insuranceCompanies,
    insuranceCoverage,
    selectedInsuranceCompanyId,
    currentTotal,
  } = params;

  const matchedItems:
    MatchedItem[] = [];

  const unmatchedItems:
    string[] = [];

  let total = 0;
  let comparisonCost = 0;

  resolvedItems.forEach((item) => {
    if (
      !item.serviceCode ||
      !item.category
    ) {
      unmatchedItems.push(
        item.originalName
      );

      comparisonCost +=
        getMissingServiceEstimate(
          item,
          medianPrices
        );

      return;
    }

    const matchedService =
      findHospitalService(
        item.serviceCode,
        hospitalServices
      );

    if (!matchedService) {
      unmatchedItems.push(
        item.originalName
      );

      comparisonCost +=
        getMissingServiceEstimate(
          item,
          medianPrices
        );

      return;
    }

    const unitPrice =
      toValidNumber(
        matchedService.price
      );

    const itemTotal =
      unitPrice * item.quantity;

    matchedItems.push({
      originalName:
        item.originalName,

      serviceCode:
        item.serviceCode,

      serviceName:
        matchedService.service_name,

      category:
        item.category,

      quantity:
        item.quantity,

      unitPrice,

      totalPrice:
        itemTotal,
    });

    total += itemTotal;
    comparisonCost += itemTotal;
  });

  const completenessScore =
    calculateCompletenessScore(
      matchedItems.length,
      resolvedItems.length
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
      toValidNumber(currentTotal) -
      total,

    comparisonCost,

    matchedServices:
      matchedItems.length,

    matchedItems,
    unmatchedItems,

    completenessScore,
    costScore: 0,
    qualityScore,
    finalScore: 0,

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
  };
}

export function buildHospitalComparison(
  params:
    BuildHospitalComparisonParams
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

  const resolvedItems =
    resolveTreatmentItems(
      items,
      keywords,
      serviceDefinitions
    );

  const medianPrices =
    buildMedianPriceByServiceCode(
      services
    );

  const baseResults =
    hospitals
      .map((hospital) => {
        const hospitalServices =
          services.filter(
            (service) =>
              service.hospital_id ===
              hospital.id
          );

        return buildBaseHospitalResult({
          hospital,
          hospitalServices,
          resolvedItems,
          medianPrices,
          insuranceCompanies,
          insuranceCoverage,
          selectedInsuranceCompanyId,
          currentTotal,
        });
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
      ) => {
        const finalDifference =
          secondResult.finalScore -
          firstResult.finalScore;

        if (finalDifference !== 0) {
          return finalDifference;
        }

        const completenessDifference =
          secondResult
            .completenessScore -
          firstResult
            .completenessScore;

        if (
          completenessDifference !== 0
        ) {
          return completenessDifference;
        }

        const ratingDifference =
          secondResult.qualityScore -
          firstResult.qualityScore;

        if (ratingDifference !== 0) {
          return ratingDifference;
        }

        return (
          firstResult.comparisonCost -
          secondResult.comparisonCost
        );
      }
    );
}