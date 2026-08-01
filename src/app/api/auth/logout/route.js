import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const cookieStore = await cookies();
  cookieStore.delete("pnc_sso_session");
  const requestUrl = new URL(request.url);
  const baseUrl = process.env.APP_URL || requestUrl.origin;
  return NextResponse.redirect(new URL("/", baseUrl));
}
