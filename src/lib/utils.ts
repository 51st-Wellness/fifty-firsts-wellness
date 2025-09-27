import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function storeAuthToken(token: string) {
  // Store token in httpOnly cookie for security
  Cookies.set("auth_token", token, {
    expires: 7, // 7 days
    secure: import.meta.env.PROD, // Only secure in production
    sameSite: "strict", // CSRF protection
    path: "/", // Available across the entire site
  });
}

export function getAuthToken() {
  return Cookies.get("auth_token");
}

export function removeAuthToken() {
  Cookies.remove("auth_token", { path: "/" });
}
