import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as productsApi from "@/features/products/api";
import type { CreateProductInput, ProductFilters } from "@/features/products/types";

const PRODUCT_KEYS = {
  all: ["products"] as const,
  list: (filters: ProductFilters) => ["products", "list", filters] as const,
  detail: (id: string) => ["products", "detail", id] as const,
  categories: ["categories"] as const,
};

export function useProductsQuery(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(filters),
    queryFn: () => productsApi.getProducts(filters),
  });
}

export function useProductDetailQuery(id: string | null) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id ?? ""),
    queryFn: () => productsApi.getProductById(id!),
    enabled: !!id,
  });
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: PRODUCT_KEYS.categories,
    queryFn: productsApi.getCategories,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProductInput) => productsApi.createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...input }: CreateProductInput & { id: string }) =>
      productsApi.updateProduct(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
}

export function useVisualSearchMutation() {
  return useMutation({
    mutationFn: productsApi.visualSearch,
  });
}
