import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect(
    new URL(
      "/signin",
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    )
  );

  // Clear the cookies
  res.cookies.delete("user");
  res.cookies.delete("token");
  return res;
}
