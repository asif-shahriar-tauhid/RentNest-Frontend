import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email address is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .refine(
      (val) => val.trim().split(/\s+/).filter(Boolean).length >= 2,
      "Please enter your full name (at least first and last name)"
    ),
  email: z.string().min(1, "Email address is required").email("Please enter a valid email address"),
  phone: z.string().min(7, "Phone number must be at least 7 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["TENANT", "LANDLORD"]),
  imgbbApiKey: z.string().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const rentalRequestSchema = z.object({
  moveInDate: z.string().min(1, "Move-in date is required"),
  duration: z.coerce.number().min(1, "Duration must be at least 1 month"),
  message: z.string().optional(),
});

export type RentalRequestFormData = z.infer<typeof rentalRequestSchema>;

export const propertySchema = z.object({
  title: z.string().min(3, "Property title must be at least 3 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  rentAmount: z.coerce.number().min(1000, "Rent amount must be at least 1,000 BDT"),
  city: z.string().min(2, "City is required"),
  district: z.string().optional(),
  address: z.string().min(5, "Full address must be at least 5 characters"),
  bedrooms: z.coerce.number().min(1, "Must have at least 1 bedroom"),
  bathrooms: z.coerce.number().min(1, "Must have at least 1 bathroom"),
  area: z.coerce.number().optional(),
  amenitiesInput: z.string().optional(),
  imagesInput: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters long"),
});

export type PropertyFormData = z.infer<typeof propertySchema>;
