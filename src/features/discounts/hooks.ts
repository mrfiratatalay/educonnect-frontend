import { useQuery } from "@tanstack/react-query";
import { getDiscounts } from "@/features/discounts/api";
import type { AppDiscount } from "@/features/discounts/types";

export const discountKeys = {
  all: ["discounts"] as const,
  list: () => [...discountKeys.all, "list"] as const,
};

export function useDiscountsQuery(enabled = true) {
  return useQuery({
    queryKey: discountKeys.list(),
    queryFn: (): Promise<AppDiscount[]> => getDiscounts(),
    enabled,
  });
}
