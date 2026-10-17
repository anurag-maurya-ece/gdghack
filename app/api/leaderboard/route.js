import { NextResponse } from "next/server";

export async function GET() {
  const leaderboard = [
    { rank: 1, name: "Ramesh Kumar", area: "Dwarka Sec 14", rating: 4.8, reviews: 52 },
    { rank: 2, name: "Suresh Patel", area: "Janakpuri Pocket B", rating: 4.6, reviews: 47 },
    { rank: 3, name: "Anita Devi", area: "Uttam Nagar East", rating: 4.5, reviews: 39 },
    { rank: 4, name: "Chhotu Chaat", area: "Subhash Nagar", rating: 4.4, reviews: 31 },
    { rank: 5, name: "Ramu Fruits", area: "Tilak Nagar", rating: 4.3, reviews: 26 },
  ];

  return NextResponse.json({
    success: true,
    leaderboard,
  });
}
