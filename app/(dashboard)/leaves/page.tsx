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
      ) : leaves.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          {/* Icon */}
          <div className="relative mb-6">
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-200 flex items-center justify-center shadow-inner">
              <svg
                className="h-12 w-12 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>
            </div>
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-300/60" />
            <span className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-yellow-300/60" />
          </div>

          {isAdmin ? (
            <>
              <h3 className="text-lg font-semibold text-zinc-800 mb-1">No leave requests yet</h3>
              <p className="text-sm text-zinc-400 max-w-sm mb-6">
                Employee leave requests will appear here once they've been submitted. Check back later.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-zinc-800 mb-1">No leave requests yet</h3>
              <p className="text-sm text-zinc-400 max-w-sm mb-6">
                You haven't submitted any leave requests. When you need time off, request it here and track the status.
              </p>
              <Button
                onClick={() => setIsRequestModalOpen(true)}
                className="gap-2 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm px-5"
              >
                <Plus className="h-4 w-4" />
                Request your first leave
              </Button>
            </>
          )}
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
