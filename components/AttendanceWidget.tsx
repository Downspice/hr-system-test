"use client";

import { useState, useEffect } from "react";
import { useGetQuery, usePostMutation, usePutMutation } from "@/hooks/api-client";
import { Attendance } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Clock, LogIn, LogOut, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function AttendanceWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: response, isLoading, refetch } = useGetQuery<Attendance>(
    "today-attendance",
    "/attendance/today"
  );

  const checkInMutation = usePostMutation<Attendance, void>("/attendance/check-in");
  const checkOutMutation = usePutMutation<Attendance, void>("/attendance/check-out");

  const attendanceRecord = response?.data as unknown as Attendance | null;

  const handleCheckIn = async () => {
    try {
      await checkInMutation.mutateAsync();
      toast.success("Checked in successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to check in");
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOutMutation.mutateAsync();
      toast.success("Checked out successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to check out");
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full rounded-2xl" />;
  }

  const isCheckedIn = !!attendanceRecord?.checkIn;
  const isCheckedOut = !!attendanceRecord?.checkOut;

  let statusText = "Not Checked In";
  let statusColor = "text-zinc-500";
  
  if (isCheckedOut) {
    statusText = "Checked Out";
    statusColor = "text-amber-600";
  } else if (isCheckedIn) {
    statusText = "Checked In";
    statusColor = "text-emerald-600";
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Decorative background element */}
      <div className="absolute -top-24 -right-24 h-64 w-64 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left side: Time and Status */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left z-10">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-1">Today's Attendance</h2>
        <div className="text-4xl sm:text-5xl font-black text-zinc-900 tracking-tight tabular-nums mb-2">
          {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </div>
        <p className="text-zinc-500 font-medium">
          {currentTime.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-zinc-50 rounded-full border border-zinc-100">
          <div className={`h-2.5 w-2.5 rounded-full ${isCheckedOut ? 'bg-amber-500' : isCheckedIn ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
          <span className={`text-sm font-bold ${statusColor}`}>{statusText}</span>
        </div>
      </div>

      {/* Right side: Action Area */}
      <div className="flex flex-col items-center z-10 w-full md:w-auto">
        {!isCheckedIn ? (
          <Button 
            onClick={handleCheckIn} 
            disabled={checkInMutation.isPending}
            className="w-full md:w-64 h-16 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-lg gap-3 shadow-lg shadow-zinc-900/20 transition-all active:scale-95"
          >
            <LogIn className="h-6 w-6" />
            Check In Now
          </Button>
        ) : !isCheckedOut ? (
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="text-center px-6 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <p className="text-sm text-emerald-800 font-medium mb-1">Checked in at</p>
              <p className="text-2xl font-bold text-emerald-900 tabular-nums">
                {new Date(attendanceRecord.checkIn).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <Button 
              onClick={handleCheckOut} 
              disabled={checkOutMutation.isPending}
              className="w-full md:w-64 h-16 rounded-2xl bg-amber-400 hover:bg-amber-500 text-zinc-900 font-bold text-lg gap-3 shadow-lg shadow-amber-400/20 transition-all active:scale-95"
            >
              <LogOut className="h-6 w-6" />
              Check Out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 bg-zinc-50 border border-zinc-100 rounded-2xl w-full md:w-64 h-full">
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-zinc-900 font-bold text-lg">Shift Completed</p>
            <p className="text-zinc-500 text-sm mt-1">
              Total: {attendanceRecord.totalHours} hrs
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
