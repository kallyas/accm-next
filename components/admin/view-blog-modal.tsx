import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Blog } from "@/hooks/use-blogs";

type ViewBlogModalProps = {
  blog: Blog;
  onClose: () => void;
};

export function ViewBlogModal({ blog, onClose }: ViewBlogModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{blog.title}</DialogTitle>
          <DialogDescription>
            By {blog.author} | Created on{" "}
            {new Date(blog.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[350px] w-full rounded-md border p-4">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
