import { ImageData } from "@/types/types";

// Generate random dimensions for masonry layout
const getRandomDimensions = () => {
  const aspectRatios = [
    { width: 1, height: 1 }, // Square
    { width: 3, height: 4 }, // Portrait
    { width: 4, height: 3 }, // Landscape
    { width: 9, height: 16 }, // Portrait video
    { width: 16, height: 9 }, // Landscape video
  ];

  return aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
};

// Generate random tags
const getTags = () => {
  const allTags = [
    "community",
    "celebration",
    "education",
    "outreach",
    "awards",
    "conference",
    "workshop",
    "milestone",
    "achievement",
    "teamwork",
  ];
  const numTags = Math.floor(Math.random() * 3) + 1; // 1 to 3 tags
  const tags: string[] = [];

  for (let i = 0; i < numTags; i++) {
    const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
    if (!tags.includes(randomTag)) {
      tags.push(randomTag);
    }
  }

  return tags;
};

// Event images
export const eventImages: ImageData[] = Array(40)
  .fill(0)
  .map((_, index) => {
    const dimensions = getRandomDimensions();
    const date = new Date(
      2024,
      Math.floor(Math.random() * 5),
      Math.floor(Math.random() * 28) + 1
    );
    const isFeatured = index % 7 === 0; // Every 7th image is featured

    return {
      id: index + 1,
      src: `/accm/IMG_${index + 4661}.JPG`,
      alt: `Community event ${index + 1}`,
      category: "events",
      description: `Captured during our ${
        ["annual", "quarterly", "monthly", "special"][
          Math.floor(Math.random() * 4)
        ]
      } community gathering.`,
      date: date.toISOString(),
      width: dimensions.width,
      height: dimensions.height,
      tags: getTags(),
      featured: isFeatured,
    };
  });

// Success story images
export const successImages: ImageData[] = Array(15)
  .fill(0)
  .map((_, index) => {
    const dimensions = getRandomDimensions();
    const date = new Date(
      2024,
      Math.floor(Math.random() * 5),
      Math.floor(Math.random() * 28) + 1
    );
    const isFeatured = index % 3 === 0; // Every 3rd success story is featured

    return {
      id: index + 100,
      src: `/whatsapp/whatsapp_${(index % 9) + 1}.jpeg`, // Loop through the 9 available images
      alt: `Success story ${index + 1}`,
      category: "success",
      description: `A remarkable achievement showcasing the impact of our initiatives.`,
      date: date.toISOString(),
      width: dimensions.width,
      height: dimensions.height,
      tags: getTags(),
      featured: isFeatured,
    };
  });

export const allImages: ImageData[] = [...eventImages, ...successImages];
