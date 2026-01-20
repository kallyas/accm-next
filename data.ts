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

// Juba events images
// "AYAN photos_x.jpg" where x is from 1 to 82
// "DSC0xxxx.jpg" - actual file numbers (non-sequential)
// folder path: /accm/juba-2026

// Actual DSC file numbers that exist
const dscFileNumbers = [
  8540, 8541, 8552, 8556, 8557, 8559, 8562, 8564, 8567, 8569,
  8572, 8573, 8575, 8577, 8578, 8580, 8583, 8588, 8589, 8592,
  8593, 8594, 8595, 8598, 8599, 8601, 8602, 8603, 8607, 8608,
  8609, 8611, 8613, 8615, 8617, 8618, 8620, 8624, 8625, 8628,
  8633, 8634, 8635, 8637, 8638, 8640, 8641, 8643, 8644, 8647,
  8648, 8649, 8654, 8657, 8659, 8661, 8663, 8669, 8670, 8672,
  8674, 8675, 8676, 8678, 8680, 8682, 8683, 8684, 8686, 8689,
  8690, 8693, 8694, 8697, 8698, 8699, 8701, 8703, 8707, 8708,
  8710, 8711, 8714, 8715, 8716, 8717, 8718, 8721, 8722, 8723,
  8726, 8727, 8729, 8731, 8733, 8736, 8738, 8739, 8741, 8742,
  8744, 8745, 8746, 8748, 8750, 8751, 8753
];

export const jubaEventImages: ImageData[] = [
  ...Array(82)
    .fill(0)
    .map((_, index) => {
      const dimensions = getRandomDimensions();
      const date = new Date(
        2026,
        Math.floor(Math.random() * 5),
        Math.floor(Math.random() * 28) + 1
      );
      const isFeatured = index % 10 === 0; // Every 10th image is featured

      return {
        id: index + 1000,
        src: `/accm/juba-2026/AYAN photos_${index + 1}.jpg`,
        alt: `16th January 2026-Juba, South Sudan - Event ${index + 1}`,
        category: "events" as const,
        description: `Captured during our special event in Juba, South Sudan.`,
        date: date.toISOString(),
        width: dimensions.width,
        height: dimensions.height,
        tags: getTags(),
        featured: isFeatured,
      };
    }),
  ...dscFileNumbers.map((fileNum, index) => {
    const dimensions = getRandomDimensions();
    const date = new Date(
      2026,
      Math.floor(Math.random() * 5),
      Math.floor(Math.random() * 28) + 1
    );
    const isFeatured = index % 15 === 0; // Every 15th image is featured

    return {
      id: index + 2000,
      src: `/accm/juba-2026/DSC0${fileNum}.jpg`,
      alt: `16th January 2026-Juba, South Sudan - Event ${index + 1}`,
      category: "events" as const,
      description: `Captured during our special event in Juba, South Sudan.`,
      date: date.toISOString(),
      width: dimensions.width,
      height: dimensions.height,
      tags: getTags(),
      featured: isFeatured,
    };
  }),
];

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

// Actual image filenames that exist in public/others directory
const otherImageFiles = [
  "IMG_0529.jpg", "IMG_0534.jpg", "IMG_0535.jpg", "IMG_0536.jpg",
  "IMG_0543.jpg", "IMG_0544.jpg", "IMG_0545.jpg", "IMG_0547.jpg",
  "IMG_0548.jpg", "IMG_0550.jpg", "IMG_0551.jpg", "IMG_0552.jpg",
  "IMG_0554.jpg", "IMG_0555.jpg", "IMG_0565.jpg", "IMG_0566.jpg",
  "IMG_0567.jpg", "IMG_0571.jpg", "IMG_0572.jpg", "IMG_0576.jpg",
  "IMG_0577.jpg"
];

export const otherImages: ImageData[] = otherImageFiles.map((filename, index) => {
  const dimensions = getRandomDimensions();
  const date = new Date(
    2024,
    Math.floor(Math.random() * 5),
    Math.floor(Math.random() * 28) + 1
  );
  const isFeatured = index % 5 === 0; // Every 5th image is featured

  return {
    id: index + 200,
    src: `/others/${filename}`,
    alt: `Other image ${index + 1}`,
    category: "others",
    description: `An additional glimpse into our diverse activities and moments.`,
    date: date.toISOString(),
    width: dimensions.width,
    height: dimensions.height,
    tags: getTags(),
    featured: isFeatured,
  };
});

// Combine all images
const mergedEventImages = [...eventImages, ...jubaEventImages];

export const allImages: ImageData[] = [...mergedEventImages, ...successImages, ...otherImages];
