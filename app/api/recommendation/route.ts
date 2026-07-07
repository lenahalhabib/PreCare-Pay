import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Recommendation API will be implemented later.",
    recommendation: null,
  });
}