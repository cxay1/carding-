import { z } from "zod";

export const giftCardCodeSchema = z
  .string()
  .min(8, "Code must be at least 8 characters")
  .max(50, "Code must be less than 50 characters")
  .regex(/^[A-Z0-9-]+$/i, "Code can only contain letters, numbers, and dashes");

export const emailSchema = z.string().email("Invalid email address");

export const amountSchema = z.number().positive("Amount must be positive").max(10000, "Amount cannot exceed 10,000");

export const regionSchema = z.enum(["US", "NG"]);

export const currencySchema = z.enum(["USD", "NGN"]);

export function validateGiftCardCode(code: string) {
  return giftCardCodeSchema.safeParse(code);
}

export function validateEmail(email: string) {
  return emailSchema.safeParse(email);
}

export function validateAmount(amount: number) {
  return amountSchema.safeParse(amount);
}

export interface ValidationError {
  field: string;
  message: string;
}

export function formatZodErrors(error: z.ZodError): ValidationError[] {
  return error.errors.map(err => ({
    field: err.path.join("."),
    message: err.message,
  }));
}