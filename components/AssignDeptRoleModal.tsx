"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetQuery } from "@/hooks/api-client";
import { DepartmentRole, User } from "@/types/types";
import { Loader2, ShieldCheck } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface AssignDeptRoleModalProps {
  user: User | null;
  departmentId: string;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (role: DepartmentRole) => void;
}

export function AssignDeptRoleModal({
  user,
  departmentId,
  isOpen,
  onClose,
  onAssign,
}: AssignDeptRoleModalProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  
  const { data: rolesResponse, isLoading } = useGetQuery<DepartmentRole>(
    ["department-roles", departmentId],
    `/departments/${departmentId}/roles`
  );

  const roles = rolesResponse?.data || [];

  const handleAssign = () => {
    const role = roles.find(r => r.id === selectedRoleId);
    if (role) {
      onAssign(role);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            Assign Department Role
          </DialogTitle>
          <DialogDescription>
            Select a specific role within the department for <strong>{user?.firstName} {user?.lastName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : roles.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No roles defined for this department. Please create roles first.
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Select Role
              </label>
              <Select onValueChange={setSelectedRoleId} value={selectedRoleId}>
                <SelectTrigger className="w-full h-11 rounded-xl border-zinc-200 focus:ring-blue-500/20">
                  <SelectValue placeholder="Choose a department role..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id} className="rounded-lg py-2.5">
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose} className="rounded-full">
            Cancel
          </Button>
          <Button 
            onClick={handleAssign} 
            disabled={!selectedRoleId}
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            Assign Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
