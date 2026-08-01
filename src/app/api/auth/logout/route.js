import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getOIDCClient } from "@/lib/oidc";

export async function GET(request) {
  const cookieStore = await cookies();
  cookieStore.delete("pnc_sso_session");
  
  const requestUrl = new URL(request.url);
  const baseUrl = process.env.APP_URL || requestUrl.origin;

  const { client, isMockMode } = await getOIDCClient();

  if (!isMockMode && client) {
    const endSessionEndpoint = client.issuer.metadata.end_session_endpoint;
    if (endSessionEndpoint) {
      const logoutUrl = `${endSessionEndpoint}?client_id=${client.client_id}&post_logout_redirect_uri=${encodeURIComponent(baseUrl)}`;
      return NextResponse.redirect(logoutUrl);
    }
  }

  return NextResponse.redirect(new URL("/", baseUrl));
}
