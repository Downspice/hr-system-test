"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetQuery, usePutMutation } from "@/hooks/api-client";
import { User } from "@/types/types";
import { Search, UserPlus, Loader2, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface AddEmployeeToDeptModalProps {
  departmentId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingUserIds: string[];
}

export function AddEmployeeToDeptModal({
  departmentId,
  isOpen,
  onClose,
  onSuccess,
  existingUserIds,
}: AddEmployeeToDeptModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: response, isLoading } = useGetQuery<User>("users", "/users");
  
  const users = response?.data || [];
  
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const isNotAlreadyInDept = !existingUserIds.includes(user.id);
      const matchesSearch = (user.firstName + " " + user.lastName + " " + user.username)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return isNotAlreadyInDept && matchesSearch;
    });
  }, [users, existingUserIds, searchQuery]);

  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const updateMutation = usePutMutation<User, { departmentId: string }>(
    isSubmitting ? `/users/${isSubmitting}` : ""
  );

  const handleAddUser = async (userId: string) => {
    setIsSubmitting(userId);
    try {
      // The user specified putting departmentId into the user record
      await updateMutation.mutateAsync({ departmentId });
      toast.success("Employee added to department");
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to add employee");
    } finally {
      setIsSubmitting(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-[2rem]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Add Employee</DialogTitle>
          <DialogDescription>
            Search for an employee to add them to this department.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or username..."
              className="pl-10 rounded-full bg-zinc-50 border-none h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="max-h-[350px] overflow-auto px-2 pb-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No employees found.
            </div>
          ) : (
            <div className="space-y-1 px-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                      <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
                      <span className="text-xs text-muted-foreground">@{user.username}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-full h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-100 hover:bg-[#facc15] hover:text-black"
                    onClick={() => handleAddUser(user.id)}
                    disabled={!!isSubmitting}
                  >
                    {isSubmitting === user.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <><UserPlus className="h-3 w-3 mr-2" /> Add</>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
