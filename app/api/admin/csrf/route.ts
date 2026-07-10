import { NextRequest, NextResponse } from "next/server";
import { getBackend } from "../_lib";

export async function GET(req: NextRequest) {
  const res = await fetch(`${getBackend()}/api/checkout/csrf-token`, {
    headers: { cookie: req.headers.get("cookie") || "" },
  });
  const data = await res.json().catch(() => ({}));
  const response = NextResponse.json(data, { status: res.status });
  // Forward the csrf_token cookie from backend to browser
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) response.headers.set("set-cookie", setCookie);
  return response;
}
