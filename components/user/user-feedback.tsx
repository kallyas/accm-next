"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, MessageSquare, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const api = {
  getFeedback: async (page = 1): Promise<PaginatedResponse> => {
    const response = await fetch(`/api/user/feedback?page=${page}`);
    if (!response.ok) {
      throw new Error("Failed to fetch feedback");
    }
    return response.json();
  },

  submitFeedback: async (content: string) => {
    const response = await fetch("/api/user/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to submit feedback");
    }
    return response.json();
  },

  deleteFeedback: async (id: string) => {
    const response = await fetch(`/api/user/feedback?id=${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete feedback");
    }
    return response.json();
  },
};

export function UserFeedback() {
  const [feedback, setFeedback] = useState("");
  const [page, setPage] = useState(1);
  const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["feedback", page],
    queryFn: () => api.getFeedback(page),
  });

  const submitMutation = useMutation({
    mutationFn: api.submitFeedback,
    onSuccess: () => {
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });
      setFeedback("");
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteFeedback,
    onSuccess: () => {
      toast({
        title: "Feedback Deleted",
        description: "Your feedback has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete feedback",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    submitMutation.mutate(feedback);
  };

  const handleDelete = async (id: string) => {
    setFeedbackToDelete(null);
    deleteMutation.mutate(id);
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 p-4 text-red-800">
        Error loading feedback: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Enter your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={5}
          disabled={submitMutation.isPending}
          className="resize-none"
        />
        <Button
          type="submit"
          disabled={submitMutation.isPending || !feedback.trim()}
        >
          {submitMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Feedback"
          )}
        </Button>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Previous Feedback</h2>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-1/4" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-5/6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data?.data.feedback.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <p className="mt-4 text-lg font-medium">No feedback yet</p>
              <p className="text-sm text-muted-foreground">
                Your submitted feedback will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {data?.data.feedback.map((item) => (
              <Card key={item.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardTitle>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setFeedbackToDelete(item.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{item.content}</p>
                </CardContent>
              </Card>
            ))}

            {(data?.data.pagination?.totalPages ?? 0) > 1 && (
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((p) =>
                      Math.min(data?.data.pagination.totalPages ?? 1, p + 1)
                    )
                  }
                  disabled={page >= (data?.data.pagination.totalPages ?? 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <AlertDialog
        open={!!feedbackToDelete}
        onOpenChange={() => setFeedbackToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this feedback? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => feedbackToDelete && handleDelete(feedbackToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
