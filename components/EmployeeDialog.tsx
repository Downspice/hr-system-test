"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import EmployeeForm from "./forms/EmployeeForm";
import { User } from "@/types/types";

interface EmployeeDialogProps {
  employee?: User;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export function EmployeeDialog({
  employee,
  isOpen,
  onClose,
  onRefresh,
}: EmployeeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{employee ? "Edit Employee" : "Register Employee"}</DialogTitle>
          <DialogDescription>
            {employee
              ? "Update the employee's personal and work information."
              : "Fill in the details to add a new member to the team."}
          </DialogDescription>
        </DialogHeader>
        <EmployeeForm
          initialData={employee}
          onSuccess={() => {
            onRefresh();
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
