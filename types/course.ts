export type Lesson = {
  id: string;
  title: string;
  content: string;
  order: number;
};

export type SortableLessonProps = {
  lesson: Lesson;
  index: number;
  moveLesson: (dragIndex: number, hoverIndex: number) => void;
};

export type Course = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  content: string;
  duration: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  isFeatured: boolean;
  previewVideoUrl?: string;
  createdAt: string;
  updatedAt: string;
  lessons: Lesson[];
};

export type CourseFilters = {
  search: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "";
};

export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CategoryFilters = {
  search: string;
};
