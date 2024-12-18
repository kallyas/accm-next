"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const lessonSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Lesson title is required"),
  content: z.string().min(1, "Lesson content is required"),
  order: z.number().min(1),
  duration: z.number().min(1, "Lesson duration is required"),
});

const courseFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
  learningObjectives: z
    .array(z.string())
    .min(1, "At least one learning objective is required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  category: z.string().min(1, "Category is required"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  isFeatured: z.boolean(),
  previewVideoUrl: z.string().url().optional(),
  lessons: z.array(lessonSchema),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      learningObjectives: [""],
      level: "Beginner",
      category: "",
      duration: 0,
      isFeatured: false,
      previewVideoUrl: "",
      lessons: [],
    },
  });

  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
    move: moveLesson,
  } = useFieldArray({
    name: "lessons",
    control: form.control,
  });

  const {
    fields: objectiveFields,
    append: appendObjective,
    remove: removeObjective,
  } = useFieldArray({
    name: "learningObjectives",
    control: form.control,
  });

  useEffect(() => {
    async function fetchCourse() {
      const response = await fetch(`/api/admin/courses/${params.id}`);
      if (response.ok) {
        const course = await response.json();
        form.reset(course);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch course data",
          variant: "destructive",
        });
      }
    }

    fetchCourse();
  }, [params.id, form]);

  async function onSubmit(values: CourseFormValues) {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/courses/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to update course");
      }

      toast({
        title: "Success",
        description: "Course updated successfully",
      });
      router.push("/admin/courses");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    moveLesson(result.source.index, result.destination.index);
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="basic">
            <TabsList>
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="details">Course Details</TabsTrigger>
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Course Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Subtitle</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={5} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Category</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Course Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value, 10))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Featured Course
                          </FormLabel>
                          <FormDescription>
                            Display this course on the featured courses list
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="previewVideoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Preview Video URL</FormLabel>
                        <FormControl>
                          <Input type="url" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="lessons">
              <Card>
                <CardHeader>
                  <CardTitle>Lessons</CardTitle>
                </CardHeader>
                <CardContent>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="lessons">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {lessonFields.map((field, index) => (
                            <Draggable
                              key={field.id}
                              draggableId={field.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="mb-4 p-4 border rounded-lg"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-lg font-semibold">
                                      Lesson {index + 1}
                                    </h4>
                                    <div className="flex items-center">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeLesson(index)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                      <div {...provided.dragHandleProps}>
                                        <GripVertical className="h-5 w-5 text-gray-500" />
                                      </div>
                                    </div>
                                  </div>
                                  <FormField
                                    control={form.control}
                                    name={`lessons.${index}.title`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Lesson Title</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`lessons.${index}.content`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Lesson Content</FormLabel>
                                        <FormControl>
                                          <Textarea {...field} rows={5} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`lessons.${index}.duration`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>
                                          Lesson Duration (minutes)
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                              field.onChange(
                                                parseInt(e.target.value, 10)
                                              )
                                            }
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <input
                                    type="hidden"
                                    {...form.register(`lessons.${index}.order`)}
                                    value={index + 1}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendLesson({
                        title: "",
                        content: "",
                        order: lessonFields.length + 1,
                        duration: 5,
                      })
                    }
                    className="mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Lesson
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Course"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
