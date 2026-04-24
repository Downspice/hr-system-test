"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, ShieldCheck } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isDeleting?: boolean;
  variant?: "destructive" | "primary";
  confirmText?: string;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isDeleting,
  variant = "destructive",
  confirmText,
}: DeleteConfirmDialogProps) {
  const isDestructive = variant === "destructive";
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] rounded-[2rem]">
        <DialogHeader className="flex flex-col items-center pt-4">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 ${
            isDestructive ? "bg-destructive/10" : "bg-blue-100"
          }`}>
            {isDestructive ? (
              <AlertTriangle className="h-6 w-6 text-destructive" />
            ) : (
              <ShieldCheck className="h-6 w-6 text-blue-600" />
            )}
          </div>
          <DialogTitle className="text-xl text-center">{title}</DialogTitle>
          <DialogDescription className="text-center pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4 sm:justify-center w-full">
          <Button variant="outline" onClick={onClose} disabled={isDeleting} className="rounded-full flex-1">
            Cancel
          </Button>
          <Button 
            variant={isDestructive ? "destructive" : "default"} 
            onClick={onConfirm} 
            disabled={isDeleting} 
            className={`rounded-full flex-1 ${!isDestructive ? "bg-blue-600 hover:bg-blue-700" : ""}`}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmText || (isDestructive ? "Confirm Delete" : "Confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
