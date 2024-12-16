import { useQuery } from "@tanstack/react-query";

async function getResources(page = 0, pageSize = 10) {
  const response = await fetch(
    `/api/resources?page=${page}&pageSize=${pageSize}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function useResources(page = 0, pageSize = 10) {
  return useQuery({
    queryKey: ["resources", page, pageSize],
    queryFn: () => getResources(page, pageSize),
  });
}
