export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
export type PropertyStatus = "AVAILABLE" | "RENTED" | "UNAVAILABLE";
export type RentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  profileImage?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  tenantId: string;
  propertyId: string;
  rentalRequestId: string;
  createdAt: string;
  tenant?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  district: string;
  rentAmount: number;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  amenities: string[];
  images: string[];
  status: PropertyStatus;
  landlordId: string;
  categoryId: string;
  updatedAt: string;
  landlord?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  category?: Category;
  reviews?: Review[];
}

export interface RentalRequest {
  id: string;
  moveInDate: string;
  duration: number;
  message?: string;
  status: RentalStatus;
  tenantId: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
  tenant?: {
    id: string;
    name: string;
    email: string;
  };
  property?: Property;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  provider: string;
  status: PaymentStatus;
  transactionId?: string;
  sessionId?: string;
  paidAt?: string;
  rentalRequestId: string;
  userId: string;
  createdAt: string;
  rentalRequest?: RentalRequest;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}
