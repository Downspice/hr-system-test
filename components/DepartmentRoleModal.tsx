"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetQuery, usePostMutation, usePutMutation, useDeleteMutation } from "@/hooks/api-client";
import { DepartmentRole } from "@/types/types";
import { Edit2, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DepartmentRoleModalProps {
  departmentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DepartmentRoleModal({ departmentId, isOpen, onClose }: DepartmentRoleModalProps) {
  const { data: response, isLoading, refetch } = useGetQuery<DepartmentRole>(
    ["department-roles", departmentId],
    `/departments/${departmentId}/roles`
  );

  const [editingRole, setEditingRole] = useState<DepartmentRole | null>(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createMutation = usePostMutation<DepartmentRole, { name: string }>(
    `/departments/${departmentId}/roles`
  );
  const updateMutation = usePutMutation<DepartmentRole, { name: string }>(
    editingRole ? `/departments/${departmentId}/roles/${editingRole.id}` : ""
  );
  const deleteMutation = useDeleteMutation();

  const roles = response?.data || [];

  const handleCreate = async () => {
    if (!newRoleName.trim()) return;
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({ name: newRoleName });
      setNewRoleName("");
      toast.success("Role created successfully");
      refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingRole || !newRoleName.trim()) return;
    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync({ name: newRoleName });
      setEditingRole(null);
      setNewRoleName("");
      toast.success("Role updated successfully");
      refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await deleteMutation.mutateAsync(`/departments/${departmentId}/roles/${roleId}`);
      toast.success("Role deleted successfully");
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Department Roles</DialogTitle>
          <DialogDescription>
            Manage the specific roles available within this department.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-end gap-2 my-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="role-name">{editingRole ? "Edit Role Name" : "New Role Name"}</Label>
            <Input
              id="role-name"
              placeholder="e.g. Lead Designer"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
          </div>
          {editingRole ? (
            <div className="flex gap-2">
              <Button onClick={handleUpdate} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update
              </Button>
              <Button variant="ghost" onClick={() => { setEditingRole(null); setNewRoleName(""); }}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          )}
        </div>

        <div className="max-h-[300px] overflow-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                    No roles found.
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingRole(role);
                            setNewRoleName(role.name);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(role.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
