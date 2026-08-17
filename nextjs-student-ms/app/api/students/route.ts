import { NextResponse } from "next/server";
import { generateRandomPassword } from "@/lib/utils";

export async function GET() {
  // Dummy members list response
  return NextResponse.json({
    members: [
      { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "member", status: "approved" },
      { id: "2", name: "Bob Smith", email: "bob@example.com", role: "member", status: "approved" },
    ],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = body;
    const generatedPassword = generateRandomPassword();

    // Dummy creation response
    return NextResponse.json({
      success: true,
      message: "Member account created successfully",
      member: {
        id: "user_" + Date.now(),
        name,
        email,
        temporaryPassword: generatedPassword,
        role: "member",
        status: "approved",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create account" },
      { status: 500 }
    );
  }
}
