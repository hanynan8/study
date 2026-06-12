// middleware.js

import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.headers.get("x-api-secret");
  
  // ✅ لو عنده توكن صح — اسمح له (طلبات السيرفر)
  if (token === process.env.API_SECRET) {
    return NextResponse.next();
  }

  // ✅ لو الطلب جاي من المتصفح من نفس الموقع — ضيف التوكن تلقائياً
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-api-secret", process.env.API_SECRET);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: "/api/data/:path*",
};