"use client";

import React, { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Sector,
} from "recharts";
import { Button } from "@/components/ui/button";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

interface ChartData {
  employeeDistribution: { name: string; count: number }[];
  salaryDistribution: { name: string; totalSalary: number }[];
  attendanceData: {
    last30Days: { label: string; count: number }[];
    thisWeek: { label: string; count: number }[];
    thisYear: { label: string; count: number }[];
    allTime: { label: string; count: number }[];
  };
}

export function DashboardCharts({ data }: { data: ChartData }) {
  const [attendancePeriod, setAttendancePeriod] = useState<keyof ChartData["attendanceData"]>("last30Days");

  const attendanceDisplayData = useMemo(() => {
    return data.attendanceData[attendancePeriod] || [];
  }, [data, attendancePeriod]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Employee Distribution Pie Chart */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-900 mb-4">Employee Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.employeeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
                label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
              >
                {data.employeeDistribution.map((entry: { name: string; count: number }, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Salary Distribution Doughnut Chart */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-900 mb-4">Salary by Department</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.salaryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="totalSalary"
                label={(props: any) => `${props.name}`}
              >
                {data.salaryDistribution.map((entry: { name: string; totalSalary: number }, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(value)}
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance History Bar Chart */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-zinc-900">Attendance Trends</h3>
          <div className="flex gap-2 bg-zinc-100 p-1 rounded-xl overflow-x-auto max-w-full">
            <Button 
              size="sm" 
              variant={attendancePeriod === "thisWeek" ? "secondary" : "ghost"} 
              className={`text-xs rounded-lg h-8 px-3 ${attendancePeriod === "thisWeek" ? "bg-white shadow-sm" : ""}`}
              onClick={() => setAttendancePeriod("thisWeek")}
            >
              This Week
            </Button>
            <Button 
              size="sm" 
              variant={attendancePeriod === "last30Days" ? "secondary" : "ghost"} 
              className={`text-xs rounded-lg h-8 px-3 ${attendancePeriod === "last30Days" ? "bg-white shadow-sm" : ""}`}
              onClick={() => setAttendancePeriod("last30Days")}
            >
              Last 30 Days
            </Button>
            <Button 
              size="sm" 
              variant={attendancePeriod === "thisYear" ? "secondary" : "ghost"} 
              className={`text-xs rounded-lg h-8 px-3 ${attendancePeriod === "thisYear" ? "bg-white shadow-sm" : ""}`}
              onClick={() => setAttendancePeriod("thisYear")}
            >
              This Year
            </Button>
            <Button 
              size="sm" 
              variant={attendancePeriod === "allTime" ? "secondary" : "ghost"} 
              className={`text-xs rounded-lg h-8 px-3 ${attendancePeriod === "allTime" ? "bg-white shadow-sm" : ""}`}
              onClick={() => setAttendancePeriod("allTime")}
            >
              All Time
            </Button>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceDisplayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar 
                dataKey="count" 
                name="Employee Count" 
                fill="#10b981" 
                radius={[6, 6, 0, 0]} 
                barSize={ attendancePeriod === "thisWeek" ? 40 : attendancePeriod === "thisYear" ? 50 : 12 }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
