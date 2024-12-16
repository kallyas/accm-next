import { useQuery } from "@tanstack/react-query";

async function getEvents(page = 0, pageSize = 10) {
  const response = await fetch(`/api/events?page=${page}&pageSize=${pageSize}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function useEvents(page = 0, pageSize = 10) {
  return useQuery({
    queryKey: ["events", page, pageSize],
    queryFn: () => getEvents(page, pageSize),
  });
}
