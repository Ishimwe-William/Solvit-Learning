import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, type, payload } = body;

    // Dummy API handler for transactional email dispatch
    console.log(`[Email Dispatch Mock] To: ${to}, Subject: "${subject}", Type: ${type}`);

    return NextResponse.json({
      success: true,
      message: "Email queued for dispatch successfully",
      recipient: to,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to dispatch email" },
      { status: 500 }
    );
  }
}
