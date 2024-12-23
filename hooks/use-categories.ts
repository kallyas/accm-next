import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Category, CategoryFilters } from "@/types/course";

const CATEGORY_KEYS = {
  all: ['categories'] as const,
  lists: () => [...CATEGORY_KEYS.all, 'list'] as const,
  list: (filters: CategoryFilters) => [...CATEGORY_KEYS.lists(), filters] as const,
};

const api = {
  getCategories: async (filters: CategoryFilters): Promise<Category[]> => {
    const params = new URLSearchParams(filters as Record<string, string>);
    const { data } = await axios.get<Category[]>(`/api/categories?${params}`);
    return data;
  },

  create: async (name: string): Promise<Category> => {
    const { data } = await axios.post<Category>('/api/categories', { name });
    return data;
  },

  update: async ({ id, name }: { id: string; name: string }): Promise<Category> => {
    const { data } = await axios.put<Category>(`/api/categories/${id}`, { name });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/api/categories/${id}`);
  }
};

export const useCategoriesQuery = (filters: CategoryFilters = { search: '' }) => 
  useQuery<Category[], AxiosError>({
    queryKey: CATEGORY_KEYS.list(filters),
    queryFn: () => api.getCategories(filters),
    staleTime: 5000,
  });

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, AxiosError, string>({
    mutationFn: api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, AxiosError, { id: string; name: string }>({
    mutationFn: api.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: api.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
    },
  });
};