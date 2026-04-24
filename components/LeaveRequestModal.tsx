"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InputWrapper from "@/components/form-wrappers/InputWrapper";
import TextareaWrapper from "@/components/form-wrappers/TextareaWrapper";
import { usePostMutation } from "@/hooks/api-client";
import { Leave } from "@/types/types";
import { toast } from "sonner";
import { Loader2, CalendarPlus } from "lucide-react";

const leaveSchema = z.object({
  reason: z.string().min(5, "Please provide a more detailed reason"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end >= start;
}, {
  message: "End date cannot be before start date",
  path: ["endDate"],
});

type LeaveFormValues = z.infer<typeof leaveSchema>;

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function LeaveRequestModal({
  isOpen,
  onClose,
  onSuccess,
}: LeaveRequestModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      reason: "",
      startDate: "",
      endDate: "",
    },
  });

  const requestLeaveMutation = usePostMutation<Leave, LeaveFormValues>("/leaves");

  const onSubmit = async (data: LeaveFormValues) => {
    try {
      await requestLeaveMutation.mutateAsync(data);
      toast.success("Leave request submitted successfully");
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit leave request");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5 text-yellow-500" />
            Request Leave
          </DialogTitle>
          <DialogDescription>
            Submit a new leave request for approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <InputWrapper
              control={control}
              name="startDate"
              label="Start Date"
              type="date"
              required
            />
            <InputWrapper
              control={control}
              name="endDate"
              label="End Date"
              type="date"
              required
            />
          </div>
          
          <TextareaWrapper
            control={control}
            name="reason"
            label="Reason"
            placeholder="Please explain the reason for your leave request..."
            required
            rows={4}
          />

          <DialogFooter className="pt-4">
            <Button variant="ghost" type="button" onClick={onClose} disabled={isSubmitting} className="rounded-full">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-full bg-yellow-400 hover:bg-yellow-500 text-black px-8">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
