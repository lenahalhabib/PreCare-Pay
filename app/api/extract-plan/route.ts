import { NextRequest, NextResponse } from "next/server";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
    }).promise;

    let text = "";

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent();

      text +=
        content.items
          .map((item: any) => ("str" in item ? item.str : ""))
          .join(" ") + "\n";
    }

    console.log("Extracted Text:");
    console.log(text);

    return NextResponse.json({
      success: true,
      text,
    });
  } catch (error) {
    console.error("PDF Error:", error);

    return NextResponse.json(
      {
        error: "Failed to read PDF",
      },
      {
        status: 500,
      }
    );
  }
}