"use client";

import { useId, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetQuery, usePatchMutation } from "@/hooks/api-client";
import { Department, User, DepartmentRole } from "@/types/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DepartmentEmployeeTable } from "@/components/DepartmentEmployeeTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  ArrowLeft, 
  Users, 
  ShieldCheck, 
  UserCircle, 
  Settings2,
  Crown
} from "lucide-react";
import { DepartmentRoleModal } from "@/components/DepartmentRoleModal";
import { AddEmployeeToDeptModal } from "@/components/AddEmployeeToDeptModal";
import { AssignDeptRoleModal } from "@/components/AssignDeptRoleModal";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, UserMinus } from "lucide-react";
import { useDynamicPutMutation, useDynamicPatchMutation } from "@/hooks/api-client";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

export default function DepartmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const departmentId = params.id as string;
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<User | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const [isAssignRoleModalOpen, setIsAssignRoleModalOpen] = useState(false);
  const [userForRoleAssignment, setUserForRoleAssignment] = useState<User | null>(null);
  const [selectedRoleForAssignment, setSelectedRoleForAssignment] = useState<DepartmentRole | null>(null);
  const [isAssignConfirmOpen, setIsAssignConfirmOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const [isManagerConfirmOpen, setIsManagerConfirmOpen] = useState(false);
  const [userForManagerAssignment, setUserForManagerAssignment] = useState<User | null>(null);
  const [isSettingManager, setIsSettingManager] = useState(false);

  // Get department details
  const { data: deptResponse, isLoading: isDeptLoading } = useGetQuery<Department>(
    ["department", departmentId],
    `/departments/${departmentId}`
  );

  // Get department users
  const { data: usersResponse, isLoading: isUsersLoading, refetch: refetchUsers } = useGetQuery<User>(
    ["department-users", departmentId],
    `/departments/${departmentId}/users`
  );
  console.log(usersResponse); 

  // Get department roles (for the assignment dropdown)
  const { data: rolesResponse } = useGetQuery<DepartmentRole>(
    ["department-roles", departmentId],
    `/departments/${departmentId}/roles`
  );

  const updateManagerMutation = usePatchMutation<Department, { managerId: string }>(
    `/departments/${departmentId}/manager`
  );

  const department = deptResponse?.data as unknown as Department;
  const users = usersResponse?.data || [];
  const roles = rolesResponse?.data || [];

  const removeUserMutation = useDynamicPutMutation<User, { departmentId: string | null; departmentRoleId: string | null }>();
  const assignRoleMutation = useDynamicPatchMutation<User, { roleId: string }>();

  const handleRemoveFromDept = (user: User) => {
    setUserToRemove(user);
    setIsRemoveDialogOpen(true);
  };

  const confirmRemoveFromDept = async () => {
    if (!userToRemove) return;
    setIsRemoving(true);
    try {
      await removeUserMutation.mutateAsync({ 
        url: `/users/${userToRemove.id}`,
        payload: { 
          departmentId: null, 
          departmentRoleId: null 
        }
      });
      toast.success(`${userToRemove.firstName} removed from department`);
      refetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove employee from department");
    } finally {
      setIsRemoving(false);
      setIsRemoveDialogOpen(false);
      setUserToRemove(null);
    }
  };

  const handleAssignRoleStep1 = (user: User) => {
    setUserForRoleAssignment(user);
    setIsAssignRoleModalOpen(true);
  };

  const handleAssignRoleStep2 = (role: DepartmentRole) => {
    setSelectedRoleForAssignment(role);
    setIsAssignRoleModalOpen(false);
    setIsAssignConfirmOpen(true);
  };

  const confirmAssignRole = async () => {
    if (!userForRoleAssignment || !selectedRoleForAssignment) return;
    setIsAssigning(true);
    try {
      await assignRoleMutation.mutateAsync({
        url: `/users/${userForRoleAssignment.id}/department-role`,
        payload: { roleId: selectedRoleForAssignment.id }
      });
      toast.success(`${userForRoleAssignment.firstName} is now a ${selectedRoleForAssignment.name}`);
      refetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign department role");
    } finally {
      setIsAssigning(false);
      setIsAssignConfirmOpen(false);
      setUserForRoleAssignment(null);
      setSelectedRoleForAssignment(null);
    }
  };

  const handleAssignManager = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setUserForManagerAssignment(user);
      setIsManagerConfirmOpen(true);
    }
  };

  const confirmAssignManager = async () => {
    if (!userForManagerAssignment) return;
    setIsSettingManager(true);
    try {
      await updateManagerMutation.mutateAsync({ managerId: userForManagerAssignment.id });
      toast.success(`${userForManagerAssignment.firstName} ${userForManagerAssignment.lastName} is now the department manager`);
      // Refresh to update manager info
      setTimeout(() => window.location.reload(), 500); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to update department manager");
    } finally {
      setIsSettingManager(false);
      setIsManagerConfirmOpen(false);
      setUserForManagerAssignment(null);
    }
  };

  if (isDeptLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{department?.name}</h1>
          <p className="text-muted-foreground">Department Overview & Employee List</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setIsRoleModalOpen(true)}>
            <Settings2 className="h-4 w-4" /> Manage Roles
          </Button>
          <Button className="gap-2 bg-zinc-900 text-white hover:bg-zinc-800" onClick={() => setIsAddUserModalOpen(true)}>
            <Plus className="h-4 w-4" /> Add Employee
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Crown className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Manager</span>
          </div>
          <div className="text-lg font-semibold">
            {department?.manager ? `${department.manager.firstName} ${department.manager.lastName}` : "Not Assigned"}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Total Employees</span>
          </div>
          <div className="text-lg font-semibold">{users.length} Members</div>
        </div>
      </div>

      <DepartmentEmployeeTable
        data={users}
        onView={(user) => router.push(`/employees/${user.id}`)}
        onSetManager={(user) => handleAssignManager(user.id)}
        onAssignRole={handleAssignRoleStep1}
        onRemove={handleRemoveFromDept}
      />

      <DepartmentRoleModal 
        departmentId={departmentId} 
        isOpen={isRoleModalOpen} 
        onClose={() => setIsRoleModalOpen(false)} 
      />

      <AddEmployeeToDeptModal
        departmentId={departmentId}
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSuccess={() => {
          refetchUsers();
          setIsAddUserModalOpen(false);
        }}
        existingUserIds={users.map(u => u.id)}
      />

      <DeleteConfirmDialog
        isOpen={isRemoveDialogOpen}
        onClose={() => setIsRemoveDialogOpen(false)}
        onConfirm={confirmRemoveFromDept}
        isDeleting={isRemoving}
        title="Remove Employee"
        description={`Are you sure you want to remove ${userToRemove?.firstName} ${userToRemove?.lastName} from this department?`}
      />

      <AssignDeptRoleModal
        user={userForRoleAssignment}
        departmentId={departmentId}
        isOpen={isAssignRoleModalOpen}
        onClose={() => setIsAssignRoleModalOpen(false)}
        onAssign={handleAssignRoleStep2}
      />

      <DeleteConfirmDialog
        isOpen={isAssignConfirmOpen}
        onClose={() => {
          setIsAssignConfirmOpen(false);
          // Keep the role selection modal potentially or just reset
        }}
        onConfirm={confirmAssignRole}
        isDeleting={isAssigning}
        variant="primary"
        confirmText="Assign Role"
        title="Confirm Role Assignment"
        description={`Are you sure you want to assign the role of "${selectedRoleForAssignment?.name}" to ${userForRoleAssignment?.firstName} ${userForRoleAssignment?.lastName}?`}
      />

      <DeleteConfirmDialog
        isOpen={isManagerConfirmOpen}
        onClose={() => setIsManagerConfirmOpen(false)}
        onConfirm={confirmAssignManager}
        isDeleting={isSettingManager}
        variant="primary"
        confirmText="Set as Manager"
        title="Confirm Manager Assignment"
        description={`Are you sure you want to set ${userForManagerAssignment?.firstName} ${userForManagerAssignment?.lastName} as the manager for this department?`}
      />
    </div>
  );
}
