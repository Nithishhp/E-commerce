import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Support both GET and POST methods for logout
export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  return NextResponse.json({ success: true });
}

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  return NextResponse.json({ success: true });
}



