"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import DepartmentForm from "./forms/DepartmentForm";
import { Department } from "@/types/types";

interface DepartmentDialogProps {
  department?: Department;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export function DepartmentDialog({
  department,
  isOpen,
  onClose,
  onRefresh,
}: DepartmentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{department ? "Edit Department" : "Create Department"}</DialogTitle>
          <DialogDescription>
            {department
              ? "Update the department details below."
              : "Fill in the details to create a new department."}
          </DialogDescription>
        </DialogHeader>
        <DepartmentForm
          initialData={department}
          onSuccess={() => {
            onRefresh();
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
