"use client";

import { useGetQuery } from "@/hooks/api-client";
import { User } from "@/types/types";
import { EmployeeDataTable } from "@/components/EmployeeDataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { EmployeeDialog } from "@/components/EmployeeDialog";
import { EmployeeViewDialog } from "@/components/EmployeeViewDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useDeleteMutation } from "@/hooks/api-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EmployeesPage() {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const { data: response, isLoading, isError, refetch } = useGetQuery<User>(
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
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-700">

      {/* Main Table Section */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full rounded-[2rem]" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-[2rem] bg-zinc-50/50">
          <p className="text-destructive font-medium">Failed to load employee directory.</p>
        </div>
      ) : (
        <EmployeeDataTable 
          data={users} 
          onEdit={(user) => {
            setSelectedUser(user);
            setIsFormOpen(true);
          }}
          onView={(user) => {
            setSelectedUser(user);
            setIsViewOpen(true);
          }}
          onDelete={(user) => {
            setSelectedUser(user);
            setIsDeleteOpen(true);
          }}
          onCreate={() => {
            setSelectedUser(undefined);
            setIsFormOpen(true);
          }}
        />
      )}

      <EmployeeDialog
        isOpen={isFormOpen}
        employee={selectedUser}
        onClose={() => setIsFormOpen(false)}
        onRefresh={refetch}
      />

      <EmployeeViewDialog
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
