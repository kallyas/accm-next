import { useQuery } from "@tanstack/react-query";

async function getMentors(page = 0, pageSize = 10) {
  const response = await fetch(
    `/api/mentors?page=${page}&pageSize=${pageSize}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function useMentors(page = 0, pageSize = 10) {
  return useQuery({
    queryKey: ["mentors", page, pageSize],
    queryFn: () => getMentors(page, pageSize),
  });
}
