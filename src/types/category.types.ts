export type CategoryService = "store" | "programme" | "podcast";

export type Category = {
  id: string;
  name: string;
  description?: string;
  service: CategoryService;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryDto = {
  name: string;
  description?: string;
  service: CategoryService;
};

export type UpdateCategoryDto = {
  name?: string;
  description?: string;
  service?: CategoryService;
};

export type CategoryQueryDto = {
  search?: string;
  service?: CategoryService;
  page?: string;
  limit?: string;
};

export type CategoriesResponse = {
  data: Category[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
