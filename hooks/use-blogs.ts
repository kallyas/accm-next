import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Define types for better type safety
export interface Blog {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  createdAt?: string;
  tags?: string[];
}

interface BlogResponse {
  blogs: Blog[];
  pageInfo: {
    page: number;
    pageSize: number;
    total: number;
  };
}

async function getBlogs(page = 0, pageSize = 10): Promise<BlogResponse> {
  const response = await fetch(`/api/blogs?page=${page}&pageSize=${pageSize}`);

  if (!response.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return response.json();
}

async function getBlogPost(id: string): Promise<Blog> {
  const response = await fetch(`/api/blogs/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch blog post");
  }

  return response.json();
}

async function createBlog(blogData: Blog): Promise<Blog> {
  const response = await fetch("/api/blogs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blogData),
  });

  if (!response.ok) {
    throw new Error("Failed to create blog post");
  }

  return response.json();
}

async function editBlog(id: string, blogData: Partial<Blog>): Promise<Blog> {
  const response = await fetch(`/api/blogs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blogData),
  });

  if (!response.ok) {
    throw new Error("Failed to update blog post");
  }

  return response.json();
}

export function useBlogs(page = 0, pageSize = 10) {
  return useQuery<BlogResponse, Error>({
    queryKey: ["blogs", page, pageSize],
    queryFn: () => getBlogs(page, pageSize),
  });
}

export function useBlogPost(id: string) {
  return useQuery<Blog, Error>({
    queryKey: ["blog", id],
    queryFn: () => getBlogPost(id),
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation<Blog, Error, Blog>({
    mutationFn: createBlog,
    onSuccess: (newBlog) => {
      // Invalidate all blog queries to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ["blogs"] });

      // Optionally, you can update the cache optimistically
      queryClient.setQueryData(
        ["blogs"],
        (oldData: BlogResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: [newBlog, ...oldData.blogs].slice(
              0,
              oldData.pageInfo.pageSize
            ),
          };
        }
      );
    },
  });
}

export function useEditBlog() {
  const queryClient = useQueryClient();

  return useMutation<Blog, Error, { id: string; blogData: Partial<Blog> }>({
    mutationFn: ({ id, blogData }) => editBlog(id, blogData),
    onSuccess: (updatedBlog, { id }) => {
      // Invalidate the specific blog query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ["blog", id] });

      // Optionally, you can update the cache optimistically
      queryClient.setQueryData(["blog", id], updatedBlog);
    },
  });
}
