"use client";

import { useGetQuery, usePatchMutation, useDynamicPatchMutation } from "@/hooks/api-client";
import { Leave, LeaveStatus, User, Role } from "@/types/types";
import { LeaveDataTable } from "@/components/LeaveDataTable";
import { LeaveRequestModal } from "@/components/LeaveRequestModal";
import { LeaveStatusDialog } from "@/components/LeaveStatusDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Calendar, Plus, Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppTabs } from "@/components/AppTabs";

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
  
  const { data: response, isLoading, isError, refetch } = useGetQuery<Leave[]>(
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
  const pendingLeaves = leaves.filter(l => l.status === "PENDING");
  const approvedLeaves = leaves.filter(l => l.status === "APPROVED");
  const otherLeaves = leaves.filter(l => l.status === "REJECTED");

  const EmptyState = ({ title, description, icon: Icon, showButton = false }: { title: string, description: string, icon: any, showButton?: boolean }) => (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[2rem] border border-zinc-100 shadow-sm px-6">
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-3xl bg-zinc-50 flex items-center justify-center shadow-inner group transition-all duration-500 hover:scale-110">
          <Icon className="h-10 w-10 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
        </div>
        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-zinc-100 animate-pulse" />
      </div>
      <h3 className="text-lg font-bold text-zinc-900 mb-1">{title}</h3>
      <p className="text-sm text-zinc-400 max-w-xs mb-8">
        {description}
      </p>
      {showButton && !isAdmin && (
        <Button
          onClick={() => setIsRequestModalOpen(true)}
          className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white gap-2 px-6"
        >
          <Plus className="h-4 w-4" /> Request Leave
        </Button>
      )}
    </div>
  );

  const tabs = [
    {
      id: "pending",
      label: "Pending Approvals",
      count: pendingLeaves.length,
      icon: <Clock className="h-4 w-4" />,
      content: pendingLeaves.length > 0 ? (
        <LeaveDataTable 
          data={pendingLeaves} 
          role={role} 
          onAction={(leave, status) => {
            setSelectedLeave(leave);
            setTargetStatus(status);
            setIsStatusDialogOpen(true);
          }} 
        />
      ) : (
        <EmptyState 
          title="No pending requests" 
          description={isAdmin ? "All caught up! No new leave requests are waiting for your review." : "You don't have any pending leave requests at the moment."}
          icon={Clock}
          showButton={true}
        />
      )
    },
    {
      id: "approved",
      label: "Approved",
      count: approvedLeaves.length,
      icon: <CheckCircle2 className="h-4 w-4" />,
      content: approvedLeaves.length > 0 ? (
        <LeaveDataTable 
          data={approvedLeaves} 
          role={role} 
          onAction={(leave, status) => {
            setSelectedLeave(leave);
            setTargetStatus(status);
            setIsStatusDialogOpen(true);
          }} 
        />
      ) : (
        <EmptyState 
          title="No approved leaves" 
          description={isAdmin ? "No approved leave requests to show yet." : "You don't have any approved leave requests yet."}
          icon={CheckCircle2}
        />
      )
    },
    {
      id: "rejected",
      label: "Rejected",
      count: otherLeaves.length,
      icon: <XCircle className="h-4 w-4" />,
      content: otherLeaves.length > 0 ? (
        <LeaveDataTable 
          data={otherLeaves} 
          role={role} 
          onAction={(leave, status) => {
            setSelectedLeave(leave);
            setTargetStatus(status);
            setIsStatusDialogOpen(true);
          }} 
        />
      ) : (
        <EmptyState 
          title="No rejected leaves" 
          description={isAdmin ? "No rejected leave requests to show." : "You don't have any rejected leave requests."}
          icon={XCircle}
        />
      )
    },
    {
      id: "all",
      label: "All Requests",
      count: leaves.length,
      icon: <AlertCircle className="h-4 w-4" />,
      content: leaves.length > 0 ? (
        <LeaveDataTable 
          data={leaves} 
          role={role} 
          onAction={(leave, status) => {
            setSelectedLeave(leave);
            setTargetStatus(status);
            setIsStatusDialogOpen(true);
          }} 
        />
      ) : (
        <EmptyState 
          title="No leave history" 
          description={isAdmin ? "No employee leave requests have been submitted yet." : "You haven't submitted any leave requests yet."}
          icon={Calendar}
          showButton={true}
        />
      )
    }
  ];

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center shadow-lg shadow-zinc-900/20">
              <Calendar className="h-6 w-6 text-white" />
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
          <Skeleton className="h-12 w-[400px] rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-[2rem]" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-[2rem] bg-zinc-50/50">
          <p className="text-destructive font-medium">Failed to load leave records.</p>
        </div>
      ) : (
        <AppTabs tabs={tabs} defaultValue="pending" />
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
