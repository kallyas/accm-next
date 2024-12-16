import { useQuery } from "@tanstack/react-query";

async function getTestimonials(page = 0, pageSize = 10) {
  const response = await fetch(
    `/api/testimonials?page=${page}&pageSize=${pageSize}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function useTestimonials(page = 0, pageSize = 10) {
  return useQuery({
    queryKey: ["testimonials", page, pageSize],
    queryFn: () => getTestimonials(page, pageSize),
  });
}
