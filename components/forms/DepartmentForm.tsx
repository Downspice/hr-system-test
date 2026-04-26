"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InputWrapper from "@/components/form-wrappers/InputWrapper";
import { Button } from "@/components/ui/button";
import { usePostMutation, usePutMutation, useGetQuery } from "@/hooks/api-client";
import { Department, User } from "@/types/types";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import SelectWrapper from "@/components/form-wrappers/SelectWrapper";
import { useState } from "react";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";
import { useDeleteMutation } from "@/hooks/api-client";
import SearchableSelectWrapper from "@/components/form-wrappers/SearchableSelectWrapper";
import { useQueryClient } from "@tanstack/react-query";

const departmentSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
  departmentManager: z.string().min(1, "Department manager is required"),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  initialData?: Department;
  onSuccess: () => void;
}

export default function DepartmentForm({ initialData, onSuccess }: DepartmentFormProps) {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: initialData?.name || "",
      departmentManager: typeof initialData?.manager === 'string' ? initialData.manager : (initialData?.manager?.id || ""), 
    },
  });

  const { data: usersResponse } = useGetQuery<User[]>("users", "/users");
  const users = usersResponse?.data || [];
  const userOptions = users
    .filter(u => 
      (u.isActive || u.id === initialData?.manager?.id) && 
      u.role === 'Employee' && 
      (!u.department || (initialData?.id && u.department.id === initialData.id))
    )
    .map(u => ({
      label: `${u.firstName} ${u.lastName} (@${u.username})${!u.isActive ? ' (Inactive)' : ''}`,
      value: u.id
    }));

  const createMutation = usePostMutation<Department, DepartmentFormValues>("/departments");
  const updateMutation = usePutMutation<Department, DepartmentFormValues>(
    initialData ? `/departments/${initialData.id}` : ""
  );
  const deleteMutation = useDeleteMutation();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onSubmit = async (data: DepartmentFormValues) => {
    try {
      if (initialData) {
        await updateMutation.mutateAsync(data);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["departments"] });
        toast.success("Department updated successfully");
      } else {
        await createMutation.mutateAsync(data);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["departments"] });
        toast.success("Department created successfully");
      }
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!initialData) return;
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync(`/departments/${initialData.id}`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department deleted successfully");
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to delete department");
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <InputWrapper
        control={control}
        name="name"
        label="Department Name"
        placeholder="e.g. Engineering"
        required
      />
      <SearchableSelectWrapper
        control={control}
        name="departmentManager"
        label="Department Manager"
        options={userOptions}
        placeholder="Select a manager"
        searchPlaceholder="Search employees..."
        required
      />
      <div className="flex justify-between gap-2 pt-4">
        {initialData && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => setIsDeleteOpen(true)}
            disabled={isSubmitting || isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
        <div className="flex gap-2 ml-auto">
          <Button type="submit" disabled={isSubmitting || isDeleting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Department" : "Create Department"}
          </Button>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Department"
        description={`Are you sure you want to delete the "${initialData?.name}" department? This action cannot be undone and will remove all associated roles.`}
      />
    </form>
  );
}
