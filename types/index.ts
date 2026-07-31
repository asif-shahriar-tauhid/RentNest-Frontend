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
    id: string,
    name:
}
