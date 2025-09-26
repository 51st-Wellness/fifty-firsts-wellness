import { httpClient } from "./http";
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryQueryDto,
  CategoriesResponse,
  CategoryService,
} from "../types/category.types";

class CategoryAPI {
  private baseURL = "/product/category";

  // Create a new category
  async create(data: CreateCategoryDto): Promise<Category> {
    const response = await httpClient.post<Category>(this.baseURL, data);
    return response.data;
  }

  // Get all categories with optional filtering
  async getAll(params?: CategoryQueryDto): Promise<CategoriesResponse> {
    const response = await httpClient.get<CategoriesResponse>(this.baseURL, {
      params,
    });
    return response.data;
  }

  // Get categories by service
  async getByService(service: CategoryService): Promise<Category[]> {
    const response = await httpClient.get<Category[]>(
      `${this.baseURL}/service/${service}`
    );
    return response.data;
  }

  // Get category by ID
  async getById(id: string): Promise<Category> {
    const response = await httpClient.get<Category>(`${this.baseURL}/${id}`);
    return response.data;
  }

  // Update category
  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const response = await httpClient.patch<Category>(
      `${this.baseURL}/${id}`,
      data
    );
    return response.data;
  }

  // Delete category
  async delete(id: string): Promise<{ message: string }> {
    const response = await httpClient.delete<{ message: string }>(
      `${this.baseURL}/${id}`
    );
    return response.data;
  }
}

export const categoryAPI = new CategoryAPI();
