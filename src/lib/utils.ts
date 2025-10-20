import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let cachedToken: string | null = null;
export function storeAuthToken(token: string) {
  // Store token in httpOnly cookie for security
  Cookies.set("auth_token", token, {
    expires: 7, // 7 days
    secure: import.meta.env.NODE_ENV === "production", // Only secure in production
    sameSite: "strict", // CSRF protection
    path: "/", // Available across the entire site
  });
  cachedToken = token || null;
}

export function getAuthToken() {
  if (cachedToken) return cachedToken;
  const token = Cookies.get("auth_token");
  console.log("token", token);
  cachedToken = token || null;
  return token;
}

export function removeAuthToken() {
  Cookies.remove("auth_token", { path: "/" });
  cachedToken = null;
}
