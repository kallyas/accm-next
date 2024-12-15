"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface CrudModalProps {
  title: string;
  description: string;
  fields: { name: string; label: string; type: string }[];
  onSubmit: (data: any) => void;
  triggerButton: React.ReactNode;
}

export function CrudModal({
  title,
  description,
  fields,
  onSubmit,
  triggerButton,
}: CrudModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState({ width: 500, height: 400 });
  const resizeRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData({ ...formData, [name]: date });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setIsOpen(false);
    setFormData({});
  };

  useEffect(() => {
    const resizeableEle = resizeRef.current;
    if (!resizeableEle) return;

    const styles = window.getComputedStyle(resizeableEle);
    let width = parseInt(styles.width, 10);
    let height = parseInt(styles.height, 10);
    let x = 0;
    let y = 0;

    resizeableEle.style.top = "50%";
    resizeableEle.style.left = "50%";
    resizeableEle.style.transform = "translate(-50%, -50%)";

    const onMouseMoveBottomRight = (event: MouseEvent) => {
      const dx = event.clientX - x;
      const dy = event.clientY - y;
      x = event.clientX;
      y = event.clientY;
      width = width + dx;
      height = height + dy;
      setSize({ width, height });
    };

    const onMouseUpBottomRight = () => {
      document.removeEventListener("mousemove", onMouseMoveBottomRight);
    };

    const onMouseDownBottomRight = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      document.addEventListener("mousemove", onMouseMoveBottomRight);
      document.addEventListener("mouseup", onMouseUpBottomRight);
    };

    const resizerBottomRight = resizeableEle.querySelector(
      ".resizer-bottom-right"
    ) as HTMLElement;
    resizerBottomRight.addEventListener("mousedown", onMouseDownBottomRight);

    return () => {
      resizerBottomRight.removeEventListener(
        "mousedown",
        onMouseDownBottomRight
      );
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="max-w-xl w-full">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 overflow-y-auto pr-4"
          style={{ maxHeight: size.height - 150 }}
        >
          {fields.map((field) => (
            <div
              key={field.name}
              className="grid w-full items-center gap-1.5 p-2"
            >
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "text" && (
                <Input
                  type="text"
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                />
              )}
              {field.type === "textarea" && (
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  rows={5}
                />
              )}
              {field.type === "date" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData[field.name] && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData[field.name] ? (
                        format(formData[field.name], "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData[field.name]}
                      onSelect={(date) => handleDateChange(field.name, date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          ))}
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
