"use client";

import { createContext, ReactNode, useContext, useState } from "react";

export type ExtractedPlanItem = {
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type TreatmentContextType = {
  extractedText: string;
  setExtractedText: (value: string) => void;

  items: ExtractedPlanItem[];
  setItems: (value: ExtractedPlanItem[]) => void;

  totalAmount: number;
  setTotalAmount: (value: number) => void;

  resetTreatment: () => void;
};

const TreatmentContext = createContext<TreatmentContextType | undefined>(
  undefined
);

export function TreatmentProvider({ children }: { children: ReactNode }) {
  const [extractedText, setExtractedText] = useState("");
  const [items, setItems] = useState<ExtractedPlanItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  function resetTreatment() {
    setExtractedText("");
    setItems([]);
    setTotalAmount(0);
  }

  return (
    <TreatmentContext.Provider
      value={{
        extractedText,
        setExtractedText,
        items,
        setItems,
        totalAmount,
        setTotalAmount,
        resetTreatment,
      }}
    >
      {children}
    </TreatmentContext.Provider>
  );
}

export function useTreatment() {
  const context = useContext(TreatmentContext);

  if (!context) {
    throw new Error("useTreatment must be used inside TreatmentProvider");
  }

  return context;
}