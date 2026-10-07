import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_BASE_URL || 'https://api.displexa.com';

async function handleProxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathname = request.nextUrl.pathname.replace('/api/bff', '');
    const isPublicMenuRead = request.method === 'GET' && pathname.startsWith('/public/menus/');
    const targetUrl = new URL(`/api${pathname}`, BACKEND_URL);
    targetUrl.search = request.nextUrl.search;

    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.delete('connection');
    headers.delete('content-length');

    if (pathname === '/onboarding/session') {
      const currentCookie = headers.get('cookie');
      if (currentCookie) {
        headers.set('cookie', currentCookie.replace(/onboarding_session=[^;]+;?\s*/g, ''));
      }
    }

    const accessToken = request.cookies.get('accessToken')?.value;
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.arrayBuffer() : undefined,
      redirect: 'manual',
      cache: isPublicMenuRead ? 'no-store' : undefined,
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('content-length');
    responseHeaders.delete('set-cookie');

    const contentType = response.headers.get('content-type') || '';
    const responseBody = response.status === 204
      ? null
      : contentType.includes('json')
        ? await response.json()
        : await response.text();

    const nextResponse = response.status === 204
      ? new NextResponse(null, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        })
      : contentType.includes('json')
        ? NextResponse.json(responseBody, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
          })
        : new NextResponse(responseBody, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
          });

    forwardBackendCookies(response, nextResponse);

    if (isPublicMenuRead) {
      nextResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      nextResponse.headers.set('Pragma', 'no-cache');
      nextResponse.headers.set('Expires', '0');
    }

    if ((pathname === '/onboarding/verify' || pathname === '/onboarding/google/register') && response.ok && responseBody) {
      setAuthCookies(nextResponse, responseBody);
    }

    return nextResponse;
  } catch (error) {
    console.error('BFF Proxy Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function forwardBackendCookies(source: Response, target: NextResponse) {
  const cookies = getSetCookieHeaders(source.headers);
  for (const cookie of cookies) {
    let rewrittenCookie = cookie.replace(/Domain=[^;]+;?/i, '');
    rewrittenCookie = rewrittenCookie.replace(/Path=[^;]+;?/i, 'Path=/;');

    if (process.env.NODE_ENV !== 'production') {
      rewrittenCookie = rewrittenCookie.replace(/Secure;?/i, '');
      rewrittenCookie = rewrittenCookie.replace(/SameSite=None;?/i, 'SameSite=Lax;');
    }

    target.headers.append('Set-Cookie', rewrittenCookie.trim());
  }
}

function getSetCookieHeaders(headers: Headers) {
  const getSetCookie = (headers as Headers & { getSetCookie?: () => string[] }).getSetCookie;
  if (getSetCookie) {
    return getSetCookie.call(headers);
  }

  const header = headers.get('set-cookie');
  return header ? [header] : [];
}

function setAuthCookies(response: NextResponse, payloadData: any) {
  const accessToken = payloadData.accessToken || payloadData.token;
  const refreshToken = payloadData.refreshToken;
  const role = payloadData.user?.role || payloadData.role || 'company_owner';

  if (accessToken) {
    response.cookies.set({
      name: 'accessToken',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
  }

  if (refreshToken) {
    response.cookies.set({
      name: 'refreshToken',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  response.cookies.set({
    name: 'role',
    value: role,
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) { return handleProxy(req, ctx); }
export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) { return handleProxy(req, ctx); }
export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) { return handleProxy(req, ctx); }
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) { return handleProxy(req, ctx); }
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) { return handleProxy(req, ctx); }
