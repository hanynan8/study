// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_COLLECTIONS = new Set([
  "navbar", "home", "footer", "about", "blogs", "contact",
  "countries", "courses", "privacy", "services", "successStories"
]);

const ADMIN_ONLY_COLLECTIONS = new Set(["auth", "form"]);

const ALLOWED_METHODS = new Set(["GET", "POST", "PUT", "DELETE", "PATCH"]);

const rateLimit = new Map();
const RATE_LIMIT = 60;
const RATE_WINDOW = 60_000;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW) {
    rateLimit.set(ip, { count: 1, start: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function cleanRateLimit() {
  const now = Date.now();
  for (const [ip, entry] of rateLimit.entries()) {
    if (now - entry.start > RATE_WINDOW) rateLimit.delete(ip);
  }
}

function deny(message, status) {
  return NextResponse.json({ error: message }, { status });
}

export async function middleware(request) {

  // ١. Method validation
  if (!ALLOWED_METHODS.has(request.method)) {
    return deny("Method not allowed", 405);
  }

  // ٢. Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  cleanRateLimit();
  if (!checkRateLimit(ip)) {
    return deny("Too many requests", 429);
  }

  // ٣. Collection validation
  const { searchParams } = new URL(request.url);
  const collection = searchParams.get("collection");

  if (!collection) {
    return deny("Missing collection", 400);
  }

  const isPublic = PUBLIC_COLLECTIONS.has(collection);
  const isAdminOnly = ADMIN_ONLY_COLLECTIONS.has(collection);

  if (!isPublic && !isAdminOnly) {
    return deny("Invalid collection", 400);
  }

  // ٤. Public GET — اسمح بدون session
  if (isPublic && request.method === "GET") {
    return NextResponse.next();
  }

  // ٥. التسجيل — اسمح بـ POST على auth بدون session
  if (collection === "auth" && request.method === "POST") {
    return NextResponse.next();
  }

  // ٦. كل حاجة تانية تحتاج session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  });

  if (!token) {
    return deny("Unauthorized", 401);
  }

  // ٧. Admin only
  if (isAdminOnly || request.method !== "GET") {
    if (token.role !== "admin") {
      return deny("Forbidden", 403);
    }
  }

  // ٨. Security headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: "/api/data/:path*",
};