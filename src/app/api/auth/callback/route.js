import { getOIDCClient } from "@/lib/oidc";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { client, isMockMode } = await getOIDCClient();
  const cookieStore = await cookies();
  const requestUrl = new URL(request.url);

  if (isMockMode) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const oidcState = cookieStore.get("oidc_state")?.value;
  const oidcNonce = cookieStore.get("oidc_nonce")?.value;

  try {
    const params = client.callbackParams(request.url);
    
    // Verify callback
    const tokenSet = await client.callback(
      process.env.OIDC_REDIRECT_URI || "http://localhost:3000/api/auth/callback",
      params,
      {
        state: oidcState,
        nonce: oidcNonce,
      }
    );

    const userinfo = await client.userinfo(tokenSet.access_token);

    const user = {
      name: userinfo.name || userinfo.given_name || userinfo.email.split("@")[0],
      email: userinfo.email,
      role: userinfo.roles || "user",
      nim: userinfo.nim || "-",
      prodi: userinfo.prodi || "Teknologi Rekayasa Perangkat Lunak",
    };

    // Store session in cookie
    cookieStore.set("pnc_sso_session", JSON.stringify(user), {
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
      secure: process.env.NODE_ENV === "production",
      httpOnly: false, // accessible to client for greeting splits
    });

    // Clear oidc state and nonce cookies
    cookieStore.delete("oidc_state");
    cookieStore.delete("oidc_nonce");

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("OIDC Callback Route Error:", error);
    return NextResponse.redirect(new URL("/?error=authentication_failed", request.url));
  }
}
