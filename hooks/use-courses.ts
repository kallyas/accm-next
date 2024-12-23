import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Course, CourseFilters } from "@/types/course";

interface PaginatedResponse<T> {
  courses: T[];
  page: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
}

interface CoursesQueryParams extends Partial<CourseFilters> {
  page?: number;
  pageSize?: number;
}

const COURSE_KEYS = {
  all: ["courses"] as const,
  lists: () => [...COURSE_KEYS.all, "list"] as const,
  list: (params: CoursesQueryParams) =>
    [...COURSE_KEYS.lists(), params] as const,
  details: () => [...COURSE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...COURSE_KEYS.details(), id] as const,
};

const api = {
  getCourses: async (
    params: CoursesQueryParams
  ): Promise<PaginatedResponse<Course>> => {
    const queryParams = new URLSearchParams({
      page: params.page?.toString() || "1",
      pageSize: params.pageSize?.toString() || "10",
      ...(params.search && { search: params.search }),
      ...(params.category && { category: params.category }),
      ...(params.level && { level: params.level }),
    });

    const { data } = await axios.get(`/api/courses?${queryParams}`);
    return data;
  },

  getCourse: async (id: string): Promise<Course> => {
    const { data } = await axios.get(`/api/courses/${id}`);
    return data;
  },

  createCourse: async (
    course: Omit<Course, "id" | "createdAt" | "updatedAt">
  ): Promise<Course> => {
    const { data } = await axios.post("/api/admin/courses", course);
    return data;
  },

  updateCourse: async ({
    id,
    ...course
  }: Partial<Course> & { id: string }): Promise<Course> => {
    const { data } = await axios.put(`/api/admin/courses/${id}`, course);
    return data;
  },

  deleteCourse: async (id: string): Promise<void> => {
    await axios.delete(`/api/courses/${id}`);
  },
};

export const useCoursesQuery = (params: CoursesQueryParams = {}) =>
  useQuery<PaginatedResponse<Course>, AxiosError>({
    queryKey: COURSE_KEYS.list(params),
    queryFn: () => api.getCourses(params),
    staleTime: 5000,
  });

export const useCourseQuery = (id: string) =>
  useQuery<Course, AxiosError>({
    queryKey: COURSE_KEYS.detail(id),
    queryFn: () => api.getCourse(id),
    enabled: Boolean(id),
  });

export const useCreateCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Course,
    AxiosError,
    Omit<Course, "id" | "createdAt" | "updatedAt">
  >({
    mutationFn: api.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.lists() });
    },
  });
};

export const useUpdateCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Course, AxiosError, Partial<Course> & { id: string }>({
    mutationFn: api.updateCourse,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.detail(variables.id) });
    },
  });
};

export const useDeleteCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: api.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.lists() });
    },
  });
};
