export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}
