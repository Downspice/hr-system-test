"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetQuery, useDynamicPatchMutation } from "@/hooks/api-client";
import { Leave } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Users, CheckCircle2, XCircle, CalendarOff,
  Fingerprint, AlertTriangle, ChevronRight, UserX, Clock,
} from "lucide-react";
import { LeaveStatusDialog } from "@/components/LeaveStatusDialog";
import { DashboardCharts } from "./DashboardCharts";

interface HRStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  pendingLeaves: number;
  thisMonthApproved: number;
  thisMonthRejected: number;
  unassignedCount: number;
}

interface HRDashboardData {
  stats: HRStats;
  recentPendingLeaves: Leave[];
  todayAttendances: any[];
  unassignedEmployees: any[];
  charts: {
    employeeDistribution: { name: string; count: number }[];
    salaryDistribution: { name: string; totalSalary: number }[];
    attendanceData: {
      last30Days: { label: string; count: number }[];
      thisWeek: { label: string; count: number }[];
      thisYear: { label: string; count: number }[];
      allTime: { label: string; count: number }[];
    };
  };
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "zinc",
  urgent = false,
}: {
  icon: any;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  urgent?: boolean;
}) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    red: "bg-red-50 text-red-600 border-red-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    zinc: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };

  return (
    <div className={`relative bg-white rounded-2xl border p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow ${urgent ? "border-amber-200" : "border-zinc-100"}`}>
      {urgent && (
        <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
      )}
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-zinc-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export function HRDashboard({ greeting }: { greeting: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [leaveDialog, setLeaveDialog] = useState<{ leave: Leave; status: "APPROVED" | "REJECTED" } | null>(null);

  const { data: response, isLoading } = useGetQuery<HRDashboardData>(
    ["dashboard-hr"],
    "/dashboard/hr",
    { staleTime: 60_000 }
  );

  const leaveMutation = useDynamicPatchMutation<Leave, { status: string; adminNote?: string }>();

  const dashData = response?.data;
  const stats = dashData?.stats;

  const handleLeaveAction = async (note: string) => {
    if (!leaveDialog) return;
    try {
      await leaveMutation.mutateAsync({
        url: `/leaves/${leaveDialog.leave.id}/status`,
        payload: { status: leaveDialog.status, adminNote: note },
      });
      toast.success(`Leave ${leaveDialog.status === "APPROVED" ? "approved" : "rejected"} successfully`);
      setLeaveDialog(null);
      queryClient.invalidateQueries({ queryKey: ["dashboard-hr"] });
    } catch {
      toast.error("Failed to update leave status");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const now = new Date();
  const hour = now.getHours();
  const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400">{timeGreeting} 👋</p>
          <h1 className="text-3xl font-bold text-zinc-900 mt-0.5">{greeting}</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-2" onClick={() => router.push("/employees")}>
            <Users className="h-4 w-4" /> Employees
          </Button>
          <Button size="sm" variant="outline" className="gap-2" onClick={() => router.push("/leaves")}>
            <CalendarOff className="h-4 w-4" /> Leaves
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Employees"
          value={stats?.totalEmployees ?? 0}
          sub={`${stats?.absentToday ?? 0} absent today`}
          color="zinc"
        />
        <StatCard
          icon={Fingerprint}
          label="Present Today"
          value={stats?.presentToday ?? 0}
          sub={`of ${stats?.totalEmployees ?? 0} employees`}
          color="emerald"
        />
        <StatCard
          icon={CalendarOff}
          label="Pending Leaves"
          value={stats?.pendingLeaves ?? 0}
          sub={`${stats?.thisMonthApproved ?? 0} approved this month`}
          color="amber"
          urgent={(stats?.pendingLeaves ?? 0) > 0}
        />
        <StatCard
          icon={UserX}
          label="No Department"
          value={stats?.unassignedCount ?? 0}
          sub="Employees needing assignment"
          color="red"
          urgent={(stats?.unassignedCount ?? 0) > 0}
        />
      </div>

      {/* Charts Section */}
      {dashData?.charts && <DashboardCharts data={dashData.charts} />}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Pending Leaves */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <CalendarOff className="h-4 w-4 text-amber-500" />
              <h2 className="font-bold text-zinc-900">Pending Leave Requests</h2>
              {(stats?.pendingLeaves ?? 0) > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                   {stats?.pendingLeaves ?? 0}
                </span>
              )}
            </div>
            <Button size="sm" variant="ghost" className="text-xs gap-1 text-zinc-500" onClick={() => router.push("/leaves")}>
              View all <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="divide-y divide-zinc-50">
            {!dashData?.recentPendingLeaves?.length ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-3" />
                <p className="font-semibold text-zinc-700">All caught up!</p>
                <p className="text-sm text-zinc-400">No pending leave requests</p>
              </div>
            ) : (
              dashData.recentPendingLeaves.map((leave) => (
                <div key={leave.id} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50/70 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-zinc-600">
                        {leave.user?.firstName?.[0]}{leave.user?.lastName?.[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-800 truncate">
                        {leave.user?.firstName} {leave.user?.lastName}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">
                        {(leave as any).user?.department?.name ?? "No dept."} · {new Date(leave.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {new Date(leave.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                      <p className="text-xs text-zinc-500 italic truncate mt-0.5">"{leave.reason}"</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <button
                      onClick={() => setLeaveDialog({ leave, status: "APPROVED" })}
                      className="h-8 w-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setLeaveDialog({ leave, status: "REJECTED" })}
                      className="h-8 w-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Attendance */}
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-emerald-500" />
                <h2 className="font-bold text-zinc-900">Checked In Today</h2>
              </div>
              <Button size="sm" variant="ghost" className="text-xs gap-1 text-zinc-500" onClick={() => router.push("/attendance")}>
                View all <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
            <div className="px-5 py-3 space-y-2.5 max-h-64 overflow-y-auto">
              {!dashData?.todayAttendances?.length ? (
                <p className="text-sm text-zinc-400 text-center py-8">No check-ins recorded yet</p>
              ) : (
                dashData.todayAttendances.map((att: any) => (
                  <div key={att.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-emerald-600">
                          {att.user?.firstName?.[0]}{att.user?.lastName?.[0]}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-zinc-800">{att.user?.firstName} {att.user?.lastName}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <Clock className="h-3 w-3" />
                      {new Date(att.checkIn).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Unassigned */}
          {(dashData?.unassignedEmployees?.length ?? 0) > 0 && (
            <div className="bg-amber-50 rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <h2 className="font-bold text-amber-900">Need Assignment</h2>
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-800 text-xs font-bold">
                     {dashData?.unassignedEmployees?.length ?? 0}
                  </span>
                </div>
              </div>
              <div className="px-5 py-3 space-y-2">
                 {dashData?.unassignedEmployees?.slice(0, 4).map((emp: any) => (
                  <div key={emp.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-amber-700">{emp.firstName[0]}{emp.lastName[0]}</span>
                      </div>
                      <p className="text-sm font-medium text-amber-900">{emp.firstName} {emp.lastName}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 pb-4">
                <Button size="sm" variant="ghost" className="w-full text-amber-700 hover:bg-amber-100 text-xs gap-1 mt-1" onClick={() => router.push("/employees")}>
                  Manage employees <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <LeaveStatusDialog
        isOpen={!!leaveDialog}
        onClose={() => setLeaveDialog(null)}
        onConfirm={handleLeaveAction}
        status={leaveDialog?.status ?? null}
        leave={leaveDialog?.leave ?? null}
        isSubmitting={leaveMutation.isPending}
      />
    </div>
  );
}
