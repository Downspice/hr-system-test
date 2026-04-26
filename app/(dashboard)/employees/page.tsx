"use client";

import { useGetQuery } from "@/hooks/api-client";
import { User } from "@/types/types";
import { EmployeeDataTable } from "@/components/EmployeeDataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { EmployeeDialog } from "@/components/EmployeeDialog";
import { EmployeeQuickViewSheet } from "@/components/EmployeeQuickViewSheet";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useDeleteMutation } from "@/hooks/api-client";
import { toast } from "sonner";

export default function EmployeesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const { data: response, isLoading, isError, refetch } = useGetQuery<User[]>(
    "users",
    "/users"
  );

  const deleteMutation = useDeleteMutation();

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteMutation.mutateAsync(`/users/${selectedUser.id}`);
      toast.success("Employee deleted successfully");
      setIsDeleteOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete employee");
    }
  };

  const users = response?.data || [];

  return (
    <div className="p-8 animate-in fade-in duration-500">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-[500px] w-full rounded-xl" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-2xl bg-zinc-50/50">
          <p className="text-destructive font-medium">Failed to load employee directory.</p>
        </div>
      ) : (
        <EmployeeDataTable
          data={users}
          onView={(user) => {
            setSelectedUser(user);
            setIsViewOpen(true);
          }}
          onEdit={(user) => {
            setSelectedUser(user);
            setIsFormOpen(true);
          }}
          onDelete={(user) => {
            setSelectedUser(user);
            setIsDeleteOpen(true);
          }}
          onCreate={() => {
            setSelectedUser(undefined);
            setIsFormOpen(true);
          }}
          onRefresh={refetch}
        />
      )}

      <EmployeeDialog
        isOpen={isFormOpen}
        employee={selectedUser}
        onClose={() => setIsFormOpen(false)}
        onRefresh={refetch}
      />

      <EmployeeQuickViewSheet
        isOpen={isViewOpen}
        employee={selectedUser}
        onClose={() => setIsViewOpen(false)}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Employee"
        description={`Are you sure you want to delete ${selectedUser?.firstName} ${selectedUser?.lastName}? This action cannot be undone.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
