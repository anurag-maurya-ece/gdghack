import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Customer login successful",
      user: {
        email,
        name: "Mr. Oberoi",
        customerId: "007",
        coins: 125,
        role: "customer",
        pincode: 110080,
      },
      token: `customer-session-${Date.now()}`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
