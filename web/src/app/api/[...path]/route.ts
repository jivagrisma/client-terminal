import { NextRequest } from "next/server";

/**
 * Proxy al backend FastAPI. A diferencia de los `rewrites` de next.config
 * (que se hornean en build), este handler lee BACKEND_URL en runtime.
 * Atraviesa el streaming SSE sin buffering.
 */

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8001";

async function proxy(req: NextRequest, path: string[]): Promise<Response> {
  const url = `${BACKEND_URL}/api/${path.join("/")}${req.nextUrl.search}`;
  const res = await fetch(url, {
    method: req.method,
    headers: { "Content-Type": "application/json" },
    body: req.method === "POST" ? await req.text() : undefined,
    cache: "no-store",
  });

  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
      "Cache-Control": "no-store",
    },
  });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
