export interface GiftCard {
  id: string;
  code: string;
  denomination: number;
  currency: "USD" | "NGN";
  region: "US" | "NG";
  status: "UNUSED" | "USED" | "EXPIRED";
  userId?: string;
  purchasedAt?: string;
  redeemedAt?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  region: "US" | "NG";
  balance: number;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  gateway: "stripe" | "paystack";
  gatewayRef: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Dispute {
  id: string;
  userId: string;
  transactionId?: string;
  type: "INVALID_CODE" | "ALREADY_USED" | "WRONG_REGION";
  status: "PENDING" | "UNDER_REVIEW" | "RESOLVED" | "REJECTED";
  evidence: string[];
  resolution?: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}