import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Hospital comparison API will be implemented later.",
    hospitals: [],
  });
}