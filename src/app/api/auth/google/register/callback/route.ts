import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_BASE_URL || "https://api.displexa.com";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export async function GET(request: NextRequest) {
  const appUrl = new URL(request.url);
  const code = appUrl.searchParams.get("code");
  const state = appUrl.searchParams.get("state");
  const error = appUrl.searchParams.get("error");
  const expectedState = request.cookies.get("google_register_oauth_state")?.value;

  if (error) {
    return redirectToOnboarding(request, "cancelled");
  }

  if (!code || !state || !expectedState || state !== expectedState) {
    return redirectToOnboarding(request, "invalid_state");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REGISTER_REDIRECT_URI || new URL("/api/auth/google/register/callback", request.url).toString();

  if (!clientId || !clientSecret) {
    return redirectToOnboarding(request, "config");
  }

  try {
    const idToken = await exchangeCodeForIdToken(code, clientId, clientSecret, redirectUri);
    if (!idToken) {
      return redirectToOnboarding(request, "google_token");
    }

    const sessionCookie = await createOnboardingSession();
    if (!sessionCookie) {
      return redirectToOnboarding(request, "session");
    }

    const backendResponse = await fetch(new URL("/api/onboarding/google/register", BACKEND_URL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `onboarding_session=${sessionCookie.value}`,
        "User-Agent": request.headers.get("user-agent") || "displexa-menu-bff",
      },
      body: JSON.stringify({ idToken }),
    });

    if (!backendResponse.ok) {
      const reason = backendResponse.status === 409
        ? "registered"
        : backendResponse.status === 401
          ? "google_token"
          : "failed";
      return redirectToOnboarding(request, reason);
    }

    const payloadData = await backendResponse.json();
    const response = NextResponse.redirect(new URL("/onboarding?googleRegistered=1", request.url));

    response.cookies.delete("google_register_oauth_state");
    setOnboardingSessionCookie(response, sessionCookie.value);
    setAuthCookies(response, payloadData);

    return response;
  } catch (error) {
    console.error("Google onboarding callback failed:", error);
    return redirectToOnboarding(request, "failed");
  }
}

async function exchangeCodeForIdToken(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
) {
  const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    return null;
  }

  const tokenPayload = await tokenResponse.json();
  return tokenPayload.id_token || null;
}

async function createOnboardingSession() {
  const sessionResponse = await fetch(new URL("/api/onboarding/session", BACKEND_URL), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });

  if (!sessionResponse.ok) {
    return null;
  }

  const setCookieHeader = getSetCookieHeaders(sessionResponse.headers)
    .find((cookie) => cookie.startsWith("onboarding_session="));
  const value = setCookieHeader?.match(/onboarding_session=([^;]+)/)?.[1];

  return value ? { value } : null;
}

function getSetCookieHeaders(headers: Headers) {
  const getSetCookie = (headers as Headers & { getSetCookie?: () => string[] }).getSetCookie;
  if (getSetCookie) {
    return getSetCookie.call(headers);
  }

  const header = headers.get("set-cookie");
  return header ? [header] : [];
}

function redirectToOnboarding(request: NextRequest, reason: string) {
  const response = NextResponse.redirect(new URL(`/onboarding?googleError=${encodeURIComponent(reason)}`, request.url));
  response.cookies.delete("google_register_oauth_state");
  return response;
}

function setOnboardingSessionCookie(response: NextResponse, value: string) {
  response.cookies.set({
    name: "onboarding_session",
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

function setAuthCookies(response: NextResponse, payloadData: any) {
  const accessToken = payloadData.accessToken || payloadData.token;
  const refreshToken = payloadData.refreshToken;
  const role = payloadData.user?.role || payloadData.role || "company_owner";

  if (accessToken) {
    response.cookies.set({
      name: "accessToken",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  }

  if (refreshToken) {
    response.cookies.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  response.cookies.set({
    name: "role",
    value: role,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}
