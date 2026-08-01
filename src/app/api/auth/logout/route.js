import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getOIDCClient } from "@/lib/oidc";

export async function GET(request) {
  const cookieStore = await cookies();
  
  // Extract id_token before deleting the session cookie
  const sessionStr = cookieStore.get("pnc_sso_session")?.value;
  let idToken = null;
  if (sessionStr) {
    try {
      const session = JSON.parse(sessionStr);
      idToken = session.id_token;
    } catch (e) {
      console.error("Failed to parse session cookie for logout:", e);
    }
  }

  cookieStore.delete("pnc_sso_session");
  
  const requestUrl = new URL(request.url);
  const baseUrl = process.env.APP_URL || requestUrl.origin;

  const { client, isMockMode } = await getOIDCClient();

  if (!isMockMode && client) {
    const endSessionEndpoint = client.issuer.metadata.end_session_endpoint;
    if (endSessionEndpoint) {
      let logoutUrl = `${endSessionEndpoint}?client_id=${client.client_id}&post_logout_redirect_uri=${encodeURIComponent(baseUrl)}`;
      if (idToken) {
        logoutUrl += `&id_token_hint=${idToken}`;
      }
      return NextResponse.redirect(logoutUrl);
    }
  }

  return NextResponse.redirect(new URL("/", baseUrl));
}
