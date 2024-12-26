import { Publication } from "@/types/publication";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type PublicationInput = Omit<Publication, "id" | "createdAt" | "updatedAt">;

// API functions
const fetchPublications = async (): Promise<Publication[]> => {
  const { data } = await axios.get<Publication[]>("/api/publications");
  return data;
};

const createPublication = async (
  publication: PublicationInput
): Promise<Publication> => {
  const { data } = await axios.post<Publication>(
    "/api/publications",
    publication
  );
  return data;
};

const updatePublication = async ({
  id,
  ...publication
}: Publication): Promise<Publication> => {
  const { data } = await axios.put<Publication>(
    `/api/publications/${id}`,
    publication
  );
  return data;
};

const deletePublication = async (id: string): Promise<void> => {
  await axios.delete(`/api/publications/${id}`);
};

// Query keys
const publicationsKeys = {
  all: ["publications"] as const,
  lists: () => [...publicationsKeys.all, "list"] as const,
  detail: (id: string) => [...publicationsKeys.all, "detail", id] as const,
};

// Hooks
export const usePublications = () => {
  return useQuery<Publication[], AxiosError>({
    queryKey: publicationsKeys.lists(),
    queryFn: fetchPublications,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreatePublication = () => {
  const queryClient = useQueryClient();

  return useMutation<Publication, AxiosError, PublicationInput>({
    mutationFn: createPublication,
    onSuccess: (newPublication) => {
      queryClient.setQueryData<Publication[]>(
        publicationsKeys.lists(),
        (old = []) => [...old, newPublication]
      );
    },
  });
};

export const useUpdatePublication = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Publication,
    AxiosError,
    Publication,
    { previousPublications?: Publication[] }
  >({
    mutationFn: updatePublication,
    onMutate: async (updatedPublication) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: publicationsKeys.lists(),
      });

      // Snapshot the previous value
      const previousPublications = queryClient.getQueryData<Publication[]>(
        publicationsKeys.lists()
      );

      // Optimistically update to the new value
      if (previousPublications) {
        queryClient.setQueryData<Publication[]>(
          publicationsKeys.lists(),
          previousPublications.map((pub) =>
            pub.id === updatedPublication.id ? updatedPublication : pub
          )
        );
      }

      // Return context with the previous value
      return { previousPublications };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPublications) {
        queryClient.setQueryData(
          publicationsKeys.lists(),
          context.previousPublications
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: publicationsKeys.lists(),
      });
    },
  });
};

export const useDeletePublication = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError,
    string,
    { previousPublications?: Publication[] }
  >({
    mutationFn: deletePublication,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({
        queryKey: publicationsKeys.lists(),
      });

      const previousPublications = queryClient.getQueryData<Publication[]>(
        publicationsKeys.lists()
      );

      if (previousPublications) {
        queryClient.setQueryData<Publication[]>(
          publicationsKeys.lists(),
          previousPublications.filter((pub) => pub.id !== deletedId)
        );
      }

      return { previousPublications };
    },
    onError: (err, variables, context) => {
      if (context?.previousPublications) {
        queryClient.setQueryData(
          publicationsKeys.lists(),
          context.previousPublications
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: publicationsKeys.lists(),
      });
    },
  });
};
