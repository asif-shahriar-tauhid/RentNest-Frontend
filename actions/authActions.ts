"use server";

import { cookies } from "next/headers";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://rentnestb7a4.vercel.app"
).replace(/\/$/, "");

export const loginAction = async (data: any) => {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Login failed",
      };
    }

    const token =
      result?.data?.accessToken ||
      result?.accessToken ||
      result?.data?.token ||
      result?.token;

    const refreshToken = result?.data?.refreshToken || result?.refreshToken;

    const cookieStore = await cookies();

    if (token) {
      cookieStore.set("accessToken", token, {
        httpOnly: false,
        path: "/",
        maxAge: 60 * 60 * 24 * 1,
        sameSite: "lax",
      });
    }

    if (refreshToken) {
      cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });
    }

    return {
      success: true,
      data: result.data || result,
      token,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Unexpected error occurred",
    };
  }
};

export const logoutAction = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("token");
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Logout failed",
    };
  }
};
