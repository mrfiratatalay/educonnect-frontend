import axios from "axios";
import { getApiErrorMessage } from "@/features/auth/api";
import { executeAuthorizedRequest } from "@/features/auth/authenticatedRequest";
import type { AppDiscount } from "@/features/discounts/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5160";

const discountsApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

interface ApiDiscountResponse {
  id: string;
  businessName: string;
  title: string;
  description: string;
  discountRate: number;
  discountCode: string;
  logoUrl?: string | null;
  validUntilUtc: string;
  isActive: boolean;
}

export async function getDiscounts(): Promise<AppDiscount[]> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      discountsApi.get<ApiDiscountResponse[]>("/api/discounts", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    return response.data.map(normalizeDiscount);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

function normalizeDiscount(discount: ApiDiscountResponse): AppDiscount {
  return {
    id: discount.id,
    businessName: discount.businessName,
    title: discount.title,
    description: discount.description,
    discountRate: discount.discountRate,
    validUntil: discount.validUntilUtc,
    isActive: discount.isActive,
    logoUrl: discount.logoUrl || undefined,
    code: discount.discountCode || undefined,
  };
}
