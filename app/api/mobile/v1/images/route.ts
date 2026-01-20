import { NextRequest } from "next/server";
import {
  allImages,
  eventImages,
  jubaEventImages,
  successImages,
  otherImages,
} from "@/data";
import {
  successResponse,
  getPaginationParams,
  handleApiError,
} from "@/lib/mobile-api-utils";
import { ImageData } from "@/types/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPaginationParams(req);

    // Get filter parameters
    const category = searchParams.get("category") || "all"; // all, events, success, others
    const featured = searchParams.get("featured") === "true";
    const sort = searchParams.get("sort") || "newest"; // newest, oldest

    // Filter images based on category
    let images: ImageData[] = [];
    switch (category) {
      case "events":
        images = [...eventImages, ...jubaEventImages];
        break;
      case "success":
        images = successImages;
        break;
      case "others":
        images = otherImages;
        break;
      default:
        images = allImages;
    }

    // Filter by featured if requested
    if (featured) {
      images = images.filter((img) => img.featured === true);
    }

    // Sort images
    images = [...images].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sort === "oldest" ? dateA - dateB : dateB - dateA;
    });

    // Calculate total before pagination
    const total = images.length;

    // Apply pagination
    const paginatedImages = images.slice(skip, skip + limit);

    return successResponse(
      {
        images: paginatedImages,
        categories: ["all", "events", "success", "others"],
        stats: {
          total: allImages.length,
          events: eventImages.length + jubaEventImages.length,
          success: successImages.length,
          others: otherImages.length,
          featured: allImages.filter((img) => img.featured).length,
        },
      },
      {
        page,
        limit,
        total,
      }
    );
  } catch (error: any) {
    return handleApiError(error);
  }
}
