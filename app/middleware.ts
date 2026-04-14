import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const middleware = authMiddleware({
  publicRoutes: ["/", "/auth", "/api/webhooks(.*)", "/api/(.*)"],
});

export default async function (request: NextRequest) {
  const country = request.geo?.country || "US";
  const region = country === "NG" ? "nigeria" : "us";

  const response = await middleware(request);
  response.headers.set("x-user-region", region);
  return response;
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};