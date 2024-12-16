import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPagination(page: number, pageSize: number) {
  const limit = pageSize
  const from = page ? page * limit : 0
  const to = page ? from + pageSize - 1 : pageSize - 1

  return { from, to }
}

