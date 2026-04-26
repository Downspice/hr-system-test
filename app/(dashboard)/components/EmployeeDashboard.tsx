"use client";

import { useGetQuery } from "@/hooks/api-client";
import { Leave, Attendance, User } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  CalendarOff,
  Clock,
  CheckCircle2,
  XCircle,
  History,
  ArrowRight,
  TrendingUp,
  Award,
  AlertCircle,
  BadgeCent,
} from "lucide-react";
import { AttendanceWidget } from "@/components/AttendanceWidget";

interface EmployeeDashboardData {
  user: User;
  todayAttendance: Attendance | null;
  stats: {
    pendingLeaves: number;
    approvedThisYear: number;
    rejectedLeaves: number;
    totalHoursThisMonth: number;
    daysWorkedThisMonth: number;
  };
  recentLeaves: Leave[];
}

function PersonalStatCard({
  icon: Icon,
  label,
  value,
  color = "zinc",
}: {
  icon: any;
  label: string;
  value: string | number;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    red: "bg-red-50 text-red-600 border-red-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    zinc: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5 flex items-center gap-4 shadow-sm">
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-bold text-zinc-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export function EmployeeDashboard({ greeting }: { greeting: string }) {
  const router = useRouter();

  const { data: response, isLoading } = useGetQuery<EmployeeDashboardData>(
    ["dashboard-employee"],
    "/dashboard/me",
    { staleTime: 60_000 }
  );

  const dashData = response?.data;
  const stats = dashData?.stats;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <Skeleton className="h-[200px] w-full rounded-[2rem]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    APPROVED: {
      label: "Approved",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
    },
    PENDING: {
      label: "Pending",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock,
    },
    REJECTED: {
      label: "Rejected",
      color: "bg-red-50 text-red-700 border-red-200",
      icon: XCircle,
    },
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">{greeting}</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Attendance Widget */}
      <AttendanceWidget />

      {/* Personal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PersonalStatCard
          icon={TrendingUp}
          label="Hours This Month"
          value={`${stats?.totalHoursThisMonth.toFixed(1) ?? 0} hrs`}
          color="blue"
        />
        <PersonalStatCard
          icon={Award}
          label="Days Worked"
          value={stats?.daysWorkedThisMonth ?? 0}
          color="emerald"
        />
        <PersonalStatCard
          icon={CalendarOff}
          label="Approved Leaves"
          value={stats?.approvedThisYear ?? 0}
          color="zinc"
        />
        <PersonalStatCard
          icon={AlertCircle}
          label="Pending Leaves"
          value={stats?.pendingLeaves ?? 0}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Leaves */}
        <div className="lg:col-span-3 bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <CalendarOff className="h-5 w-5 text-zinc-400" />
              <h2 className="font-bold text-zinc-900">My Recent Leaves</h2>
            </div>
            <Button size="sm" variant="ghost" className="text-xs gap-1 text-zinc-500" onClick={() => router.push("/leaves")}>
              View history <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex-1 divide-y divide-zinc-50">
            {!dashData?.recentLeaves?.length ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="h-16 w-16 rounded-3xl bg-zinc-50 flex items-center justify-center mb-4">
                  <CalendarOff className="h-8 w-8 text-zinc-300" />
                </div>
                <p className="font-bold text-zinc-900">No leave history</p>
                <p className="text-sm text-zinc-400 mt-1 max-w-[240px]">
                  You haven't requested any leaves yet.
                </p>
                <Button size="sm" className="mt-4 rounded-full bg-zinc-900" onClick={() => router.push("/leaves")}>
                  Request Leave
                </Button>
              </div>
            ) : (
              dashData.recentLeaves.map((leave) => {
                const config = statusConfig[leave.status];
                return (
                  <div key={leave.id} className="px-8 py-5 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-zinc-900">{leave.reason}</p>
                      <p className="text-xs text-zinc-500">
                        {new Date(leave.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {new Date(leave.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.color}`}>
                      <config.icon className="h-3.5 w-3.5" />
                      {config.label}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Profile Snapshot */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-zinc-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-zinc-900/20">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <BadgeCent className="h-32 w-32" />
              </div>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Current Role</p>
              <h3 className="text-2xl font-bold mb-4">{dashData?.user?.departmentRole?.name || "Employee"}</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <History className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Department</p>
                    <p className="text-sm font-semibold">{dashData?.user?.department?.name || "General"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <BadgeCent className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Salary</p>
                    <p className="text-sm font-semibold">
                      {new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(dashData?.user?.salary || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-8 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl h-12"
                onClick={() => router.push(`/employees/${dashData?.user?.id}`)}
              >
                View full profile
              </Button>
           </div>

           <div className="bg-white rounded-[2rem] border border-zinc-100 p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">Work Hours</h3>
                  <p className="text-xs text-zinc-500">This month so far</p>
                </div>
             </div>
             
             <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-black text-zinc-900 tracking-tight">
                    {stats?.totalHoursThisMonth.toFixed(1) ?? 0}
                  </p>
                  <p className="text-sm font-bold text-zinc-500">Hours logged</p>
                </div>
                <div className="text-right">
                   <p className="text-lg font-bold text-zinc-900">{stats?.daysWorkedThisMonth ?? 0}</p>
                   <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Days active</p>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
