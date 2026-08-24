"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteProps {
  id: string;
  endpoint: string;       // যেমন: "/about/deleteAboutContent"
  queryKey: string[];     // যেমন: ["about"]
  successMessage?: string; // সাকসেস মেসেজ কাস্টমাইজ করার জন্য
  itemName?: string;      // মোডালে নাম দেখানোর জন্য (যেমন: "About Section")
}

export function DeleteModule({ 
  id, 
  endpoint, 
  queryKey, 
  successMessage = "Deleted successfully", 
  itemName = "Item" 
}: DeleteProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${endpoint}/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      // ডাইনামিক কুয়েরি ইনভ্যালিডেশন
      queryClient.invalidateQueries({ queryKey: queryKey });
      toast.success(successMessage);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-3 bg-zinc-900 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl border border-zinc-800 transition-all">
          <Trash2 className="h-5 w-5" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px] bg-[#1a1a1a] border-zinc-800 text-white">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <DialogTitle className="text-xl font-bold">Are you absolutely sure?</DialogTitle>
          <DialogDescription className="text-zinc-400">
            This action cannot be undone. This will permanently delete the
            <span className="text-white font-semibold italic"> {itemName}</span> from the database.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row gap-3 sm:justify-center mt-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent border-zinc-800 hover:bg-zinc-800 text-zinc-300"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            type="button"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Yes, Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}