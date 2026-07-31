/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApiResponse,
  Category,
  Payment,
  Property,
  PropertyStatus,
  RentalRequest,
  RentalStatus,
  Review,
  User,
  UserStatus,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getCookie = (name: string): string | null => {
  if (typeof window === "undefined" || typeof document === "undefined")
    return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const clientFetch = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const url = `${API_URL}${endpoint}`;

  const token =
    typeof window !== "undefined"
      ? getCookie("accessToken") || getCookie("token")
      : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "An error occurred");
  }

  return data.data;
};

export const serverFetch = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const token =
    cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

  const url = `${API_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Cookie: cookieString,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    cache: options.cache || "no-store",
  });

  const data: ApiResponse<T> = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "An error occurred");
  }
  return data.data;
};

export const api = {
  auth: {
    me: (isServer = false) =>
      isServer
        ? serverFetch<User>("/api/auth/me")
        : clientFetch<User>("/api/auth/me"),
    login: (data: any) =>
      clientFetch<{ user: User; accessToken: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    register: (data: any) =>
      clientFetch<User>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    logout: () => clientFetch("/api/auth/logout", { method: "POST" }),
    updateProfile: (data: Partial<User>) =>
      clientFetch<User>("/api/auth/me", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },

  properties: {
    getAll: (params: string = "", isServer = false) => {
      const fetcher = isServer ? serverFetch : clientFetch;
      return fetcher<any>(`/api/property${params ? `?${params}` : ""}`);
    },
    getById: (id: string, isServer = false) => {
      const fetcher = isServer ? serverFetch : clientFetch;
      return fetcher<Property>(`/api/property/${id}`);
    },
    create: (data: Partial<Property>) =>
      clientFetch<Property>("/api/property", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Property>) =>
      clientFetch<Property>(`/api/property/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      clientFetch<Property>(`/api/property/${id}`, {
        method: "DELETE",
      }),
    updateStatus: (id: string, status: PropertyStatus) =>
      clientFetch<Property>(`/api/property/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
  },
  categories: {
    getAll: (isServer = false) => {
      const fetcher = isServer ? serverFetch : clientFetch;
      return fetcher<Category[]>("/api/categories");
    },
  },
  rentals: {
    create: (data: {
      propertyId: string;
      moveInDate: string;
      duration: number;
      message?: string;
    }) =>
      clientFetch<RentalRequest>("/api/rentals", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getAll: (isServer = false) => {
      const fetcher = isServer ? serverFetch : clientFetch;
      return fetcher<RentalRequest[]>("/api/rentals");
    },
    getById: (id: string, isServer = false) => {
      const fetcher = isServer ? serverFetch : clientFetch;
      return fetcher<RentalRequest>(`/api/rentals/${id}`);
    },
    updateStatus: (id: string, status: RentalStatus) =>
      clientFetch<RentalRequest>(`/api/rentals/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
  },

  payments: {
    create: (rentalRequestId: string) =>
      clientFetch<{ url: string }>("/api/payments/create", {
        method: "POST",
        body: JSON.stringify({ rentalRequestId }),
      }),
    confirm: (sessionId: string) =>
      clientFetch<Payment>("/api/payments/confirm", {
        method: "POST",
        body: JSON.stringify({ sessionId }),
      }),
    getAll: (isServer = false) => {
      const fetcher = isServer ? serverFetch : clientFetch;
      return fetcher<Payment[]>("/api/payments");
    },
  },

  reviews: {
    create: (data: {
      propertyId: string;
      rentalRequestId: string;
      rating: number;
      comment?: string;
    }) =>
      clientFetch<Review>(`/api/reviews`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getByProperty: (propertyId: string, isServer = false) => {
      const fetcher = isServer ? serverFetch : clientFetch;
      return fetcher<Review[]>(`/api/reviews/property/${propertyId}`);
    },
  },

  admin: {
    getUsers: (isServer = false) => {
      const fetcher = isServer ? serverFetch : clientFetch;
      return fetcher<User[]>("/api/admin/users");
    },
    updateUserStatus: async (id: string, status: UserStatus) => {
      try {
        return await clientFetch<User>(`/api/admin/users/${id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        try {
          return await clientFetch<User>(`/api/users/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error2) {
          return await clientFetch<User>(`/api/admin/users/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
          });
        }
      }
    },
    getProperties: (isServer = false) => {
      const fetcher = isServer ? serverFetch : clientFetch;
      return fetcher<Property[]>("/api/admin/properties");
    },
    getRentals: (isServer = false) => {
      const fetcher = isServer ? serverFetch : clientFetch;
      return fetcher<RentalRequest[]>("/api/admin/rentals");
    },
    getPayments: (isServer = false) => {
      const fetcher = isServer ? serverFetch : clientFetch;
      return fetcher<Payment[]>("/api/admin/payments");
    },
  },
};
