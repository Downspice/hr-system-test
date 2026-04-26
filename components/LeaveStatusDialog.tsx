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
import TextareaWrapper from "@/components/form-wrappers/TextareaWrapper";
import { Leave, LeaveStatus } from "@/types/types";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import React, { useEffect } from "react";

interface LeaveStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
  status: LeaveStatus | null;
  leave: Leave | null;
  isSubmitting: boolean;
}

export function LeaveStatusDialog({
  isOpen,
  onClose,
  onConfirm,
  status,
  leave,
  isSubmitting,
}: LeaveStatusDialogProps) {
  const isRejecting = status === "REJECTED";

  const schema = z.object({
    note: isRejecting 
      ? z.string().min(5, "A reason is required for rejection (min 5 characters)") 
      : z.string().optional(),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      note: "",
    },
  });

  // Reset form when status changes or modal closes
  useEffect(() => {
    if (!isOpen) {
      reset({ note: "" });
    }
  }, [isOpen, reset]);

  const onSubmit = (data: FormValues) => {
    onConfirm(data.note || "");
  };

  if (!status) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isRejecting ? (
              <>
                <XCircle className="h-5 w-5 text-rose-500" />
                Reject Leave Request
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Approve Leave Request
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isRejecting 
              ? "Please provide a reason for rejecting this leave request."
              : "You can optionally add a note for the employee before approving."}
          </DialogDescription>
        </DialogHeader>

        {leave && (
          <div className="mt-2 p-4 rounded-md bg-zinc-50 border border-zinc-100 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Employee</p>
                <p className="text-sm font-semibold text-zinc-900">{leave.user?.firstName} {leave.user?.lastName}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">leave period</p>
                <p className="text-sm font-semibold text-zinc-900">
                  {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Reason for Leave</p>
              <p className="text-sm text-zinc-600 line-clamp-2 italic">"{leave.reason}"</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <TextareaWrapper
            control={control}
            name="note"
            label={isRejecting ? "Rejection Reason" : "Approval Note"}
            placeholder={isRejecting ? "Explain why the request is being rejected..." : "Add a note (optional)..."}
            required={isRejecting}
            rows={3}
          />

          <DialogFooter className="pt-2">
            <Button variant="ghost" type="button" onClick={onClose} disabled={isSubmitting} className="rounded-full">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className={Object.assign({
                "rounded-full px-8": true
              }, isRejecting ? "bg-rose-500 hover:bg-rose-600 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white")}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isRejecting ? "Reject Request" : "Approve Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
