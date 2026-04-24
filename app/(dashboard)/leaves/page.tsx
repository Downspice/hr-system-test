"use client";

import { useGetQuery, usePatchMutation, useDynamicPatchMutation } from "@/hooks/api-client";
import { Leave, LeaveStatus, User, Role } from "@/types/types";
import { LeaveDataTable } from "@/components/LeaveDataTable";
import { LeaveRequestModal } from "@/components/LeaveRequestModal";
import { LeaveStatusDialog } from "@/components/LeaveStatusDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LeavesPage() {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [targetStatus, setTargetStatus] = useState<LeaveStatus | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage");
      }
    }
  }, []);

  const role = currentUser?.role || "Employee";
  const isAdmin = role === "Admin" || role === "HR";

  // Endpoint depends on role
  const endpoint = isAdmin ? "/leaves" : "/leaves/my-history";
  
  const { data: response, isLoading, isError, refetch } = useGetQuery<Leave>(
    ["leaves", role],
    endpoint
  );

  const updateStatusMutation = useDynamicPatchMutation<Leave, { status: LeaveStatus, adminNote?: string }>();

  const handleUpdateStatus = async (note: string) => {
    if (!selectedLeave || !targetStatus) return;

    try {
      await updateStatusMutation.mutateAsync({
        url: `/leaves/${selectedLeave.id}/status`,
        payload: { 
          status: targetStatus,
          adminNote: note
        }
      });
      toast.success(`Leave request ${targetStatus.toLowerCase()} successfully`);
      setIsStatusDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update leave status");
    }
  };

  const leaves = response?.data || [];

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/20">
              <Calendar className="h-6 w-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                {isAdmin ? "Leave Management" : "My Leaves"}
              </h1>
              <p className="text-zinc-500 font-medium">
                {isAdmin ? "Review and manage employee leave requests." : "Track and manage your leave requests."}
              </p>
            </div>
          </div>
          
          {!isAdmin && (
            <Button 
              onClick={() => setIsRequestModalOpen(true)}
              className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white gap-2 px-6 shadow-lg shadow-zinc-900/10"
            >
              <Plus className="h-4 w-4" /> Request Leave
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full rounded-[2rem]" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-[2rem] bg-zinc-50/50">
          <p className="text-destructive font-medium">Failed to load leave records.</p>
        </div>
      ) : (
        <LeaveDataTable 
          data={leaves} 
          role={role} 
          onAction={(leave, status) => {
            setSelectedLeave(leave);
            setTargetStatus(status);
            setIsStatusDialogOpen(true);
          }} 
        />
      )}

      <LeaveRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={refetch}
      />

      <LeaveStatusDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        onConfirm={handleUpdateStatus}
        status={targetStatus}
        leave={selectedLeave}
        isSubmitting={updateStatusMutation.isPending}
      />
    </div>
  );
}
