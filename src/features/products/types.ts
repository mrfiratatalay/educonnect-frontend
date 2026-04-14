export interface CategoryResponse {
  id: string;
  name: string;
}

export type ProductCondition = "new" | "likeNew" | "good" | "fair";

export interface ProductResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId: string | null;
  categoryName: string | null;
  sellerId: string;
  sellerName: string;
  condition: ProductCondition;
  isActive: boolean;
  city: string;
  isNegotiable: boolean;
  imageUrls: string[];
  createdAtUtc: string;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface ProductFilters {
  searchTerm?: string;
  categoryId?: string;
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition;
  page?: number;
  pageSize?: number;
}

export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  categoryId?: string;
  condition: ProductCondition;
  city: string;
  isNegotiable: boolean;
  imageUrls: string[];
}

export const CONDITION_LABELS: Record<ProductCondition, string> = {
  new: "Sıfır",
  likeNew: "Yeni gibi",
  good: "İyi",
  fair: "Kullanılmış",
};

export const CONDITION_COLORS: Record<ProductCondition, string> = {
  new: "green",
  likeNew: "cyan",
  good: "blue",
  fair: "default",
};
