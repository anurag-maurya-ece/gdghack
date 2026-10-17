export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

let reviewsStore = [
  {
    _id: "rev-1",
    name: "Mansi Chaubey",
    vendornumber: "9876543210",
    vendorName: "Ramesh Bhaiya",
    msg: "Bilkul fresh sabzi deliver ki! Ekdum farm fresh tamatar aur palak.",
    rating: 5,
    email: "mansi@example.com",
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    _id: "rev-2",
    name: "Vikram Malhotra",
    vendornumber: "9123456780",
    vendorName: "Suresh Cart",
    msg: "Bulao Thela ping karne par 5 minute me aa gaye. Bahut badhiya service!",
    rating: 5,
    email: "vikram@example.com",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const vendor = searchParams.get("vendor");

  if (vendor) {
    const filtered = reviewsStore.filter((r) => r.vendornumber === vendor || r.vendorName === vendor);
    return NextResponse.json({ success: true, reviews: filtered });
  }

  return NextResponse.json({ success: true, reviews: reviewsStore });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, vendornumber, vendorName, msg, email, rating } = body;

    const newRev = {
      _id: `rev-${Date.now()}`,
      name: name || "Verified Customer",
      vendornumber: vendornumber || "9876543210",
      vendorName: vendorName || "Ramesh Bhaiya",
      msg: msg || "Great fresh produce!",
      rating: rating || 5,
      email: email || "customer@example.com",
      createdAt: new Date().toISOString(),
    };

    reviewsStore.unshift(newRev);

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully! +25 Coins awarded.",
      review: newRev,
      rewardCoins: 25,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
