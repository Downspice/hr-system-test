"use client";

import { useGetQuery } from "@/hooks/api-client";
import { Attendance, User } from "@/types/types";
import { AttendanceWidget } from "@/components/AttendanceWidget";
import { AttendanceDataTable } from "@/components/AttendanceDataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

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

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/20">
              <Clock className="h-6 w-6 text-black" />
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
        <div className="space-y-4 mt-4">
          <Skeleton className="h-[400px] w-full rounded-[2rem]" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-[2rem] bg-zinc-50/50 mt-4">
          <p className="text-destructive font-medium">Failed to load attendance records.</p>
        </div>
      ) : (
        <div className="mt-4">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">{isAdmin ? "All Records" : "My History"}</h2>
          <AttendanceDataTable 
            data={attendances} 
            role={role} 
          />
        </div>
      )}
    </div>
  );
}
