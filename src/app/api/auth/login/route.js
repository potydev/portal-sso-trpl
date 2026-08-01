import { getOIDCClient } from "@/lib/oidc";
import { generators } from "openid-client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { client, isMockMode } = await getOIDCClient();
  const cookieStore = await cookies();

  if (isMockMode) {
    // In mock mode, we immediately log in a mock user
    const mockUser = {
      name: "Matthew Tampubolon",
      email: "matthew@pnc.ac.id",
      role: "mahasiswa",
      nim: "220302088",
      prodi: "Teknologi Rekayasa Perangkat Lunak",
    };

    cookieStore.set("pnc_sso_session", JSON.stringify(mockUser), {
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
      secure: process.env.NODE_ENV === "production",
      httpOnly: false, // accessible to client for greeting splits
    });

    const requestUrl = new URL(request.url);
    const baseUrl = process.env.APP_URL || requestUrl.origin;
    return NextResponse.redirect(new URL("/dashboard", baseUrl));
  }

  try {
    const nonce = generators.nonce();
    const state = generators.state();

    // Store state and nonce in encrypted/secure cookies to verify during callback
    cookieStore.set("oidc_state", state, {
      path: "/",
      maxAge: 300, // 5 minutes
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });

    cookieStore.set("oidc_nonce", nonce, {
      path: "/",
      maxAge: 300, // 5 minutes
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });

    const authUrl = client.authorizationUrl({
      scope: "openid email profile",
      state,
      nonce,
    });

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Login route error:", error);
    const requestUrl = new URL(request.url);
    const baseUrl = process.env.APP_URL || requestUrl.origin;
    return NextResponse.redirect(new URL("/?error=auth_failed", baseUrl));
  }
}
