"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetQuery, useDeleteMutation, useDynamicPatchMutation } from "@/hooks/api-client";
import { User, Leave } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ArrowLeft,
  Mail,
  Briefcase,
  Shield,
  Edit2,
  Trash2,
  User as UserIcon,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BadgeCent,
  FileText,
  Fingerprint,
  Ban,
  UserCheck,
  Calendar as CalendarIcon,
  RotateCcw,
  Search,
} from "lucide-react";
import { Attendance } from "@/types/types";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { EmployeeDialog } from "@/components/EmployeeDialog";
import { AppTabs } from "@/components/AppTabs";
import { addDays, format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { type DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/DateRangePicker";

type TabKey = "leaves" | "attendance";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  APPROVED: {
    label: "Approved",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  PENDING: {
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-50 text-red-600 border-red-200",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

export default function EmployeeProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const { data: userResponse, isLoading: isUserLoading, refetch } = useGetQuery<User>(
    ["employee", id],
    `/users/${id}`
  );

  const { data: leavesResponse, isLoading: isLeavesLoading } = useGetQuery<Leave>(
    ["employee-leaves", id],
    `/leaves/user/${id}`
  );

  const { data: attendanceResponse, isLoading: isAttendanceLoading } = useGetQuery<Attendance>(
    ["employee-attendance", id],
    `/attendance/user/${id}`
  );

  const deleteMutation = useDeleteMutation();
  const statusMutation = useDynamicPatchMutation<User, { isActive: boolean }>();

  const employee = userResponse?.data as unknown as User;
  const leaves: Leave[] = (leavesResponse?.data || []) as unknown as Leave[];
  const rawAttendances: Attendance[] = (attendanceResponse?.data || []) as unknown as Attendance[];

  const filteredAttendances = useMemo(() => {
    if (!dateRange?.from) return rawAttendances;
    
    const start = startOfDay(dateRange.from);
    const end = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);

    return rawAttendances.filter((record) => {
      const recordDate = new Date(record.date);
      return isWithinInterval(recordDate, { start, end });
    });
  }, [rawAttendances, dateRange]);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(`/users/${id}`);
      toast.success("Employee deleted successfully");
      router.push("/employees");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete employee");
    }
  };

  const handleToggleStatus = async () => {
    try {
      await statusMutation.mutateAsync({
        url: `/users/${id}/status`,
        payload: { isActive: !employee.isActive },
      });
      toast.success(`User ${!employee.isActive ? 'enabled' : 'disabled'} successfully`);
      setIsStatusOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  if (isUserLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-[320px_1fr] gap-6">
          <Skeleton className="h-[500px] rounded-2xl" />
          <Skeleton className="h-[500px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-8 text-center">
        <p className="text-zinc-500">Employee not found.</p>
        <Button variant="ghost" onClick={() => router.push("/employees")} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Employees
        </Button>
      </div>
    );
  }

  const fullName = `${employee.firstName} ${employee.lastName}`;
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Breadcrumb + Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/employees")}
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <div className="h-5 w-px bg-zinc-200" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-zinc-900">{fullName}</h1>
              <div className={`h-2.5 w-2.5 rounded-full shadow-sm mt-1 ${employee.isActive ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
            </div>
            <p className="text-sm text-zinc-500 mt-0.5">{employee.email}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className={`h-9 gap-1.5 font-semibold transition-all shadow-sm border-none ${employee.isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'} text-white`}
            onClick={() => setIsStatusOpen(true)}
            disabled={statusMutation.isPending}
          >
            {employee.isActive ? <Ban className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
            {employee.isActive ? 'Disable User' : 'Enable User'}
          </Button>
          <Button
            size="sm"
            className="h-9 gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-sm"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit User
          </Button>
          <Button
            size="sm"
            className="h-9 gap-1.5 bg-red-500 hover:bg-red-600 text-white border-none shadow-sm"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete User
          </Button>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Left: Account Details card */}
        <div className="rounded-lg border border-zinc-100 bg-white shadow-sm p-6 space-y-5">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Account Details</h2>

          {/* Avatar */}
          <div className="flex flex-col items-center pt-2 pb-4">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-4 ring-zinc-100 shadow-md">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.username}`} />
                <AvatarFallback className="bg-zinc-800 text-white text-2xl font-bold">{initials}</AvatarFallback>
              </Avatar>
              <span className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-white shadow-sm ${employee.isActive ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-zinc-900">{fullName}</h3>
          </div>

          {/* Info rows */}
          <div className="space-y-4 pt-2 border-t border-zinc-100">
            <div className="space-y-0.5">
              <p className="text-xs text-zinc-400 font-medium">Status</p>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${employee.isActive ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                <span className={`text-sm font-semibold ${employee.isActive ? 'text-emerald-700' : 'text-zinc-600'}`}>
                  {employee.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-zinc-400 font-medium">Email</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-700">{employee.email}</span>
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-zinc-400 font-medium">Date Joined</p>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-700">
                  {new Date(employee.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-zinc-400 font-medium">Role</p>
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-700">{employee.role}</span>
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-zinc-400 font-medium">Department</p>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-700">{employee.department?.name || "Not Assigned"}</span>
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-zinc-400 font-medium">Department Role</p>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-700">{employee.departmentRole?.name || "Not Assigned"}</span>
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-zinc-400 font-medium">Salary</p>
              <div className="flex items-center gap-2">
                <BadgeCent className="h-4 w-4 text-zinc-400" />
                <span className="text-sm font-semibold text-zinc-900">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "GHS",
                  }).format(employee.salary || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Tab panel */}
        <div className="rounded-lg border border-zinc-100 bg-white shadow-sm overflow-hidden flex flex-col p-6">
          <AppTabs
            tabs={[
              {
                id: "leaves",
                label: "Leave History",
                icon: <FileText className="h-4 w-4" />,
                count: leaves.length,
                content: (
                  <div className="space-y-4 pt-4">
                    {isLeavesLoading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-16 rounded-xl" />
                        ))}
                      </div>
                    ) : leaves.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-16 w-16 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
                          <AlertCircle className="h-8 w-8 text-zinc-400" />
                        </div>
                        <p className="text-base font-medium text-zinc-600">No leave records yet</p>
                        <p className="text-sm text-zinc-400 mt-1">Leave history will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {leaves.map((leave) => {
                          const config = statusConfig[leave.status] || statusConfig["PENDING"];
                          return (
                            <div
                              key={leave.id}
                              className="flex items-start justify-between p-4 rounded-xl border border-zinc-100 hover:bg-zinc-50/70 transition-colors"
                            >
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-zinc-800">{leave.reason}</p>
                                <div className="flex items-center gap-3 text-xs text-zinc-500">
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3" />
                                    {new Date(leave.startDate).toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                    {" → "}
                                    {new Date(leave.endDate).toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Applied{" "}
                                    {new Date(leave.createdAt).toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "short",
                                    })}
                                  </span>
                                </div>
                                {leave.adminNote && (
                                  <p className="text-xs text-zinc-400 italic">Note: {leave.adminNote}</p>
                                )}
                              </div>
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}
                              >
                                {config.icon}
                                {config.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )
              },
              {
                id: "attendance",
                label: "Attendance History",
                icon: <Fingerprint className="h-4 w-4" />,
                count: rawAttendances.length,
                content: (
                  <div className="space-y-4 pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-50/50 p-3 rounded-xl border border-zinc-100">
                      <DateRangePicker 
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange}
                      />

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-zinc-500 bg-white border border-zinc-100 px-2.5 py-1 rounded-full shadow-sm">
                          {filteredAttendances.length} records found
                        </span>
                      </div>
                    </div>

                    {isAttendanceLoading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-16 rounded-xl" />
                        ))}
                      </div>
                    ) : filteredAttendances.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-16 w-16 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
                          <Fingerprint className="h-8 w-8 text-zinc-400" />
                        </div>
                        <p className="text-base font-medium text-zinc-600">
                          {dateRange ? "No records for this range" : "No attendance records yet"}
                        </p>
                        <p className="text-sm text-zinc-400 mt-1">
                          {dateRange ? "Try selecting a different date range" : "Attendance logs will appear here"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredAttendances.map((record) => (
                          <div
                            key={record.id}
                            className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 hover:bg-zinc-50/70 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-blue-50 flex flex-col items-center justify-center shrink-0 border border-blue-100">
                                <span className="text-[10px] font-bold text-blue-600 uppercase">
                                  {new Date(record.date).toLocaleDateString("en-US", { month: "short" })}
                                </span>
                                <span className="text-sm font-bold text-blue-700 -mt-1">
                                  {new Date(record.date).getDate()}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-semibold text-zinc-800">
                                  {new Date(record.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-zinc-500">
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="h-3 w-3 text-emerald-500" />
                                    IN: {new Date(record.checkIn).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                  {record.checkOut ? (
                                    <span className="flex items-center gap-1.5">
                                      <Clock className="h-3 w-3 text-amber-500" />
                                      OUT: {new Date(record.checkOut).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                  ) : (
                                    <span className="text-amber-600 font-medium italic">Still Checked In</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Duration</p>
                              <p className="text-sm font-bold text-zinc-900">
                                {record.totalHours ? `${record.totalHours.toFixed(1)} hrs` : "—"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
            ]}
          />
        </div>
      </div>

      {/* Edit dialog */}
      <EmployeeDialog
        isOpen={isEditOpen}
        employee={employee}
        onClose={() => setIsEditOpen(false)}
        onRefresh={refetch}
      />

      {/* Delete dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Employee"
        description={`Are you sure you want to delete ${fullName}? This action cannot be undone.`}
        isDeleting={deleteMutation.isPending}
      />

      <DeleteConfirmDialog
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        onConfirm={handleToggleStatus}
        title={employee.isActive ? "Disable User" : "Enable User"}
        description={employee.isActive
          ? `Are you sure you want to disable ${fullName}? They will no longer be able to log in.`
          : `Are you sure you want to enable ${fullName}? They will regain access to the system.`
        }
        isDeleting={statusMutation.isPending}
        variant={employee.isActive ? "destructive" : "primary"}
        confirmText={employee.isActive ? "Disable User" : "Enable User"}
      />
    </div>
  );
}
