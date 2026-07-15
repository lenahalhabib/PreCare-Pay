import { supabase } from "@/lib/supabase";

import type {
  Hospital,
  HospitalService,
  InsuranceCompany,
  InsuranceCoverage,
  ServiceDefinition,
  ServiceKeyword,
} from "@/shared/utils/hospitalComparison";

export type ComparisonData = {
  hospitals: Hospital[];
  hospitalServices: HospitalService[];
  serviceKeywords: ServiceKeyword[];
  serviceDefinitions: ServiceDefinition[];
  insuranceCompanies: InsuranceCompany[];
  insuranceCoverage: InsuranceCoverage[];
};

export const comparisonService = {
  async getComparisonData(): Promise<ComparisonData> {
    const [
      hospitalsResult,
      hospitalServicesResult,
      serviceKeywordsResult,
      serviceDefinitionsResult,
      insuranceCompaniesResult,
      insuranceCoverageResult,
    ] = await Promise.all([
      supabase
        .from("hospitals")
        .select(`
          id,
          name,
          location,
          rating,
          accreditation,
          guarantee_days
        `),

      supabase
        .from("hospital_services")
        .select(`
          id,
          hospital_id,
          service_code,
          service_name,
          price,
          duration_days
        `),

      supabase
        .from("service_keywords")
        .select(`
          id,
          service_code,
          keyword
        `),

      supabase
        .from("services")
        .select(`
          service_code,
          display_name,
          category
        `),

      supabase
        .from("insurance_companies")
        .select(`
          id,
          company_code,
          name,
          plan_type
        `)
        .order("plan_type", {
          ascending: true,
        }),

      supabase
        .from("insurance_category_coverage")
        .select(`
          id,
          insurance_company_id,
          category,
          coverage_percentage
        `),
    ]);

    if (hospitalsResult.error) {
      throw new Error(
        `Failed to load hospitals: ${hospitalsResult.error.message}`
      );
    }

    if (hospitalServicesResult.error) {
      throw new Error(
        `Failed to load hospital services: ${hospitalServicesResult.error.message}`
      );
    }

    if (serviceKeywordsResult.error) {
      throw new Error(
        `Failed to load service keywords: ${serviceKeywordsResult.error.message}`
      );
    }

    if (serviceDefinitionsResult.error) {
      throw new Error(
        `Failed to load service definitions: ${serviceDefinitionsResult.error.message}`
      );
    }

    if (insuranceCompaniesResult.error) {
      throw new Error(
        `Failed to load insurance companies: ${insuranceCompaniesResult.error.message}`
      );
    }

    if (insuranceCoverageResult.error) {
      throw new Error(
        `Failed to load insurance coverage: ${insuranceCoverageResult.error.message}`
      );
    }

    return {
      hospitals:
        (hospitalsResult.data ?? []) as Hospital[],

      hospitalServices:
        (hospitalServicesResult.data ?? []) as HospitalService[],

      serviceKeywords:
        (serviceKeywordsResult.data ?? []) as ServiceKeyword[],

      serviceDefinitions:
        (serviceDefinitionsResult.data ?? []) as ServiceDefinition[],

      insuranceCompanies:
        (insuranceCompaniesResult.data ?? []) as InsuranceCompany[],

      insuranceCoverage:
        (insuranceCoverageResult.data ?? []) as InsuranceCoverage[],
    };
  },
};