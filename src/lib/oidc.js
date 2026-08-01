import { Issuer } from "openid-client";

let oidcClient = null;
let isMockMode = false;
let isInitialized = false;

export async function getOIDCClient() {
  if (isInitialized) {
    return { client: oidcClient, isMockMode };
  }

  try {
    const issuerUrl = process.env.OIDC_ISSUER;
    const clientId = process.env.OIDC_CLIENT_ID || "app-portal";
    const clientSecret = process.env.OIDC_CLIENT_SECRET;
    const redirectUri = process.env.OIDC_REDIRECT_URI || "http://localhost:3000/api/auth/callback";

    if (!issuerUrl || issuerUrl.includes("PASTE_")) {
      throw new Error("OIDC_ISSUER is not configured");
    }

    const issuer = await Issuer.discover(issuerUrl);
    console.log("Discovered Keycloak Issuer:", issuer.issuer);

    oidcClient = new issuer.Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [redirectUri],
      response_types: ["code"],
    });
  } catch (error) {
    console.warn("⚠️ Warning: OIDC setup failed. Running in MOCK MODE for local development/preview.");
    console.warn("Error details:", error.message);
    isMockMode = true;
  }

  isInitialized = true;
  return { client: oidcClient, isMockMode };
}
