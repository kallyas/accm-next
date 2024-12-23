import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GripVertical, Trash2 } from "lucide-react";

export const SortableLesson = ({ lesson, index, removeLesson, form }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: lesson.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-6 p-6 border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-semibold">Lesson {index + 1}</h4>
        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeLesson(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div {...attributes} {...listeners}>
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
            <FormLabel>Lesson Duration (minutes)</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
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
  );
};
