"use client";

import { useGetQuery } from "@/hooks/api-client";
import { Attendance, User } from "@/types/types";
import { AttendanceWidget } from "@/components/AttendanceWidget";
import { AttendanceDataTable } from "@/components/AttendanceDataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Clock, Calendar, ChevronRight, History, Users, ArrowRight } from "lucide-react";
import { AppTabs } from "@/components/AppTabs";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AttendancePage() {
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
  const endpoint = isAdmin ? "/attendance" : "/attendance/my-history";
  
  const { data: response, isLoading, isError } = useGetQuery<Attendance>(
    ["attendances", role],
    endpoint
  );

  const attendances = response?.data || [];
  
  const [selectedDateRecords, setSelectedDateRecords] = useState<{ date: string; records: Attendance[] } | null>(null);

  // Helper to format date consistently
  const formatDate = (dateStr: string) => new Date(dateStr).toISOString().split('T')[0];
  const todayStr = new Date().toISOString().split('T')[0];

  const todayAttendances = attendances.filter(a => formatDate(a.date) === todayStr);
  
  // Group previous records by date
  const groupedHistory = attendances
    .filter(a => formatDate(a.date) !== todayStr)
    .reduce((acc, curr) => {
      const date = formatDate(curr.date);
      if (!acc[date]) acc[date] = [];
      acc[date].push(curr);
      return acc;
    }, {} as Record<string, Attendance[]>);

  const historyDates = Object.entries(groupedHistory).sort((a, b) => b[0].localeCompare(a[0]));

  const EmptyState = ({ title, description, icon: Icon }: { title: string, description: string, icon: any }) => (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[2rem] border border-zinc-100 shadow-sm px-6">
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-3xl bg-zinc-50 flex items-center justify-center shadow-inner group transition-all duration-500 hover:scale-110">
          <Icon className="h-10 w-10 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
        </div>
        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-zinc-100 animate-pulse" />
      </div>
      <h3 className="text-lg font-bold text-zinc-900 mb-1">{title}</h3>
      <p className="text-sm text-zinc-400 max-w-xs">{description}</p>
    </div>
  );

  const tabs = [
    {
      id: "today",
      label: "Today's Attendance",
      count: todayAttendances.length,
      icon: <Users className="h-4 w-4" />,
      content: todayAttendances.length > 0 ? (
        <div className="space-y-4">
          <AttendanceDataTable data={todayAttendances} role={role} />
        </div>
      ) : (
        <EmptyState 
          title="No records for today" 
          description={isAdmin ? "No employees have checked in yet today." : "You haven't checked in for today yet."}
          icon={Clock}
        />
      )
    },
    {
      id: "previous",
      label: "Previous Records",
      count: historyDates.length,
      icon: <History className="h-4 w-4" />,
      content: historyDates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {historyDates.map(([date, records]) => (
            <Card 
              key={date}
              onClick={() => setSelectedDateRecords({ date, records })}
              className="group p-5 hover:border-zinc-300 hover:shadow-md transition-all cursor-pointer rounded-2xl border-zinc-100 bg-white relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                  <Calendar className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 font-bold px-2.5 py-0.5 rounded-lg border-none">
                  {records.length} {records.length === 1 ? 'Record' : 'Records'}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Date</p>
                <h3 className="text-lg font-bold text-zinc-900">
                  {new Date(date).toLocaleDateString("en-US", { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </h3>
              </div>
              <div className="mt-4 flex items-center text-sm font-semibold text-zinc-400 group-hover:text-zinc-900 transition-colors gap-1">
                View Details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No history found" 
          description="There are no previous attendance records available in the system."
          icon={History}
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
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                Attendance
              </h1>
              <p className="text-zinc-500 font-medium">
                {isAdmin ? "Track employee work hours and attendance history." : "Manage your daily check-ins and track your hours."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {!isAdmin && <AttendanceWidget />}

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-[400px] rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-[2rem]" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-[2rem] bg-zinc-50/50">
          <p className="text-destructive font-medium">Failed to load attendance records.</p>
        </div>
      ) : (
        <AppTabs tabs={tabs} defaultValue="today" />
      )}

      {/* History Detail Dialog */}
      <Dialog open={!!selectedDateRecords} onOpenChange={() => setSelectedDateRecords(null)}>
        <DialogContent className="max-w-[95vw] lg:max-w-6xl p-0 overflow-hidden border-none rounded-[2rem]">
          <DialogHeader className="p-8 bg-zinc-50 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-zinc-900">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-zinc-900">
                  {selectedDateRecords && new Date(selectedDateRecords.date).toLocaleDateString("en-US", { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </DialogTitle>
                <p className="text-zinc-500 text-sm font-medium">
                  {selectedDateRecords?.records.length} records found for this day
                </p>
              </div>
            </div>
          </DialogHeader>
          <div className="p-8">
            {selectedDateRecords && (
              <AttendanceDataTable 
                data={selectedDateRecords.records} 
                role={role} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
