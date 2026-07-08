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

export type MatchedItem = {
  originalName: string;
  serviceCode: string;
  serviceName: string;
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
};

function normalizeText(value: string) {
  return value.toLowerCase().trim();
}

function findServiceCode(itemName: string, keywords: ServiceKeyword[]) {
  const cleanItemName = normalizeText(itemName);

  const matchedKeyword = keywords.find((keyword) => {
    const cleanKeyword = normalizeText(keyword.keyword);

    return (
      cleanItemName.includes(cleanKeyword) ||
      cleanKeyword.includes(cleanItemName)
    );
  });

  return matchedKeyword?.service_code || null;
}

export function buildHospitalComparison(params: {
  hospitals: Hospital[];
  services: HospitalService[];
  keywords: ServiceKeyword[];
  items: TreatmentItem[];
  currentTotal: number;
}) {
  const { hospitals, services, keywords, items, currentTotal } = params;

  return hospitals
    .map((hospital) => {
      const hospitalServices = services.filter(
        (service) => service.hospital_id === hospital.id
      );

      const matchedItems: MatchedItem[] = [];
      const unmatchedItems: string[] = [];

      let total = 0;
      let duration = 0;

      items.forEach((item) => {
        const itemName = item.serviceName || "";
        const quantity = Number(item.quantity || 1);

        const serviceCode = findServiceCode(itemName, keywords);

        if (!serviceCode) {
          unmatchedItems.push(itemName);
          return;
        }

        const matchedService = hospitalServices.find(
          (service) => service.service_code === serviceCode
        );

        if (!matchedService) {
          unmatchedItems.push(itemName);
          return;
        }

        const unitPrice = Number(matchedService.price);
        const itemTotal = unitPrice * quantity;
        const itemDuration = Number(matchedService.duration_days || 1);

        matchedItems.push({
          originalName: itemName,
          serviceCode,
          serviceName: matchedService.service_name,
          quantity,
          unitPrice,
          totalPrice: itemTotal,
          durationDays: itemDuration,
        });

        total += itemTotal;
        duration += itemDuration;
      });

      return {
        hospital,
        total,
        savings: Number(currentTotal || 0) - total,
        duration,
        matchedServices: matchedItems.length,
        matchedItems,
        unmatchedItems,
      };
    })
    .filter((result) => result.matchedServices > 0)
    .sort((a, b) => a.total - b.total);
}