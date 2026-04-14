import axios from "axios";
import { executeAuthorizedRequest } from "@/features/auth/authenticatedRequest";
import type {
  CategoryResponse,
  CreateProductInput,
  PagedResponse,
  ProductFilters,
  ProductResponse,
} from "@/features/products/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5160";

const productsApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export async function getProducts(
  filters: ProductFilters = {},
): Promise<PagedResponse<ProductResponse>> {
  const params = new URLSearchParams();
  if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.sellerId) params.set("sellerId", filters.sellerId);
  if (filters.minPrice != null) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.condition) params.set("condition", filters.condition);
  params.set("page", String(filters.page ?? 1));
  params.set("pageSize", String(filters.pageSize ?? 12));

  const response = await executeAuthorizedRequest<PagedResponse<ProductResponse>>(
    (token) =>
      productsApi.get(`/api/products?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
  );
  return response.data;
}

export async function getProductById(id: string): Promise<ProductResponse> {
  const response = await executeAuthorizedRequest<ProductResponse>((token) =>
    productsApi.get(`/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
  return response.data;
}

export async function createProduct(
  input: CreateProductInput,
): Promise<ProductResponse> {
  const response = await executeAuthorizedRequest<ProductResponse>((token) =>
    productsApi.post("/api/products", input, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await executeAuthorizedRequest<void>((token) =>
    productsApi.delete(`/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
}

export async function getCategories(): Promise<CategoryResponse[]> {
  const response = await executeAuthorizedRequest<CategoryResponse[]>((token) =>
    productsApi.get("/api/categories", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
  return response.data;
}

export async function updateProduct(
  id: string,
  input: CreateProductInput,
): Promise<ProductResponse> {
  const response = await executeAuthorizedRequest<ProductResponse>((token) =>
    productsApi.put(`/api/products/${id}`, input, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
  return response.data;
}

export async function visualSearch(formData: FormData) {
  const response = await executeAuthorizedRequest((token) =>
    productsApi.post("/api/visualsearch/searches", formData, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
  return response.data;
}
