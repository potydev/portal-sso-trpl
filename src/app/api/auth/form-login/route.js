import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const cookieStore = await cookies();
  
  try {
    // Read urlencoded body or json body
    const contentType = request.headers.get("content-type") || "";
    let username = "";
    let password = "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      username = formData.get("username") || "";
      password = formData.get("password") || "";
    } else {
      const body = await request.json();
      username = body.username || "";
      password = body.password || "";
    }

    const requestUrl = new URL(request.url);
    const baseUrl = process.env.APP_URL || requestUrl.origin;

    if (!username || !password) {
      return NextResponse.redirect(new URL("/?error=invalid_credentials", baseUrl));
    }

    // Simulate login for preview
    const user = {
      name: username.toUpperCase(),
      email: `${username.toLowerCase()}@pnc.ac.id`,
      role: "mahasiswa",
      nim: username,
      prodi: "Teknologi Rekayasa Perangkat Lunak",
    };

    cookieStore.set("pnc_sso_session", JSON.stringify(user), {
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
      secure: process.env.NODE_ENV === "production",
      httpOnly: false, // accessible to client
    });

    return NextResponse.redirect(new URL("/dashboard", baseUrl));
  } catch (error) {
    console.error("Form login error:", error);
    const requestUrl = new URL(request.url);
    const baseUrl = process.env.APP_URL || requestUrl.origin;
    return NextResponse.redirect(new URL("/?error=authentication_failed", baseUrl));
  }
}
