"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, X, Sparkles } from "lucide-react";
import BottomNavigation from "@/shared/components/navigation/BottomNavigation";
import { useTreatment } from "@/shared/context/TreatmentContext";

export default function CreatePlanPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { setExtractedText, setItems, setTotalAmount } = useTreatment();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manualText, setManualText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canAnalyze = selectedFile !== null || manualText.trim().length > 0;

  function handleFileSelect(file: File) {
    setErrorMessage("");

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Please upload a PDF or image file.");
      return;
    }

    setSelectedFile(file);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    if (isAnalyzing) return;

    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }

  function formatFileSize(size: number) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }

  async function handleAnalyze() {
    if (!canAnalyze || isAnalyzing) return;

    try {
      setIsAnalyzing(true);
      setErrorMessage("");

      const formData = new FormData();

      if (manualText.trim()) {
        formData.append("text", manualText.trim());
      } else if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await fetch("/api/extract-plan", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to analyze treatment plan.");
      }

      setExtractedText(result.text || manualText.trim() || "");
      setItems(result.items || []);
      setTotalAmount(result.totalAmount || 0);

      router.push("/review-plan");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#D4E0DF] flex flex-col">
      <section className="flex-1 px-6 pt-12 pb-10">
        <header className="mb-8">
          <h1 className="font-serif text-4xl text-[#476973]">PreCare Pay</h1>

          <p className="mt-3 text-[#476973]/80 leading-6">
            Upload your dental treatment plan to compare hospitals and find the
            best option for you.
          </p>
        </header>

        <div className="rounded-[34px] bg-[#F8FBFA] p-6 shadow-sm">
          <h2 className="font-serif text-3xl text-[#476973] text-center">
            Upload Treatment Plan
          </h2>

          <div
            onClick={() => {
              if (!isAnalyzing) fileInputRef.current?.click();
            }}
            onDragOver={(event) => {
              event.preventDefault();
              if (!isAnalyzing) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`mt-8 rounded-[30px] border-2 border-dashed p-8 text-center transition ${
              isAnalyzing
                ? "cursor-not-allowed border-[#C8D2D0] bg-white opacity-70"
                : isDragging
                ? "cursor-pointer border-[#476973] bg-[#D4E0DF]"
                : "cursor-pointer border-[#B8C9C6] bg-white"
            }`}
          >
            {!selectedFile ? (
              <>
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#D4E0DF]">
                  <Upload size={34} className="text-[#476973]" />
                </div>

                <p className="mt-5 font-serif text-2xl text-[#476973]">
                  Tap to upload
                </p>

                <p className="mt-2 text-sm text-[#476973]/70">
                  PDF • JPG • PNG • WEBP
                </p>
              </>
            ) : (
              <div className="text-left">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4E0DF]">
                    <FileText size={28} className="text-[#476973]" />
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-[#476973]">
                      {selectedFile.name}
                    </p>
                    <p className="mt-1 text-sm text-[#476973]/70">
                      {selectedFile.type.includes("pdf")
                        ? "PDF Document"
                        : "Image File"}{" "}
                      • {formatFileSize(selectedFile.size)}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isAnalyzing}
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="rounded-full bg-[#EEF4F3] p-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={18} className="text-[#476973]" />
                  </button>
                </div>

                <p className="mt-5 text-center text-sm font-medium text-[#476973]">
                  {isAnalyzing ? "File is being analyzed..." : "Tap to change file"}
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              disabled={isAnalyzing}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
          </div>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#C8D2D0]" />
            <span className="text-sm text-[#476973]/70">or</span>
            <div className="h-px flex-1 bg-[#C8D2D0]" />
          </div>

          <textarea
            value={manualText}
            disabled={isAnalyzing}
            onChange={(event) => setManualText(event.target.value)}
            placeholder="Paste your treatment plan text here..."
            className="min-h-36 w-full resize-none rounded-[28px] border border-[#D4E0DF] bg-white p-5 text-[#476973] outline-none placeholder:text-[#476973]/50 disabled:cursor-not-allowed disabled:opacity-70"
          />

          {errorMessage && (
            <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          {isAnalyzing && (
            <div className="mt-5 rounded-[26px] border border-[#D4E0DF] bg-white p-5 text-center shadow-sm">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#D4E0DF] border-t-[#476973]" />

              <p className="font-semibold text-[#476973]">
                Analyzing your plan...
              </p>

              <p className="mt-1 text-sm leading-6 text-[#476973]/70">
                Please wait while we read and extract your treatment details.
              </p>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze || isAnalyzing}
            className={`mt-7 flex w-full items-center justify-center gap-2 rounded-3xl py-4 font-serif text-xl transition disabled:cursor-not-allowed ${
              canAnalyze && !isAnalyzing
                ? "bg-[#476973] text-white hover:bg-[#3d5d66]"
                : "bg-[#C8D2D0] text-white"
            }`}
          >
            {isAnalyzing ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={22} />
                Analyze Plan
              </>
            )}
          </button>
        </div>
      </section>

      <BottomNavigation />
    </main>
  );
}