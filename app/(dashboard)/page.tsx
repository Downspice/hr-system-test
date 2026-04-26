"use client";

import { useEffect, useState } from "react";
import { AdminDashboard } from "./components/AdminDashboard";
import { HRDashboard } from "./components/HRDashboard";
import { EmployeeDashboard } from "./components/EmployeeDashboard";

export default function Page() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage");
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-64 bg-zinc-100 rounded-xl" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-zinc-100 rounded-2xl" />
            ))}
          </div>
          <div className="h-96 bg-zinc-100 rounded-[2rem]" />
        </div>
      </div>
    );
  }

  const role = user.role || "Employee";
  const greetingName = user.firstName || user.username || "there";

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {role === "Admin" && <AdminDashboard greeting={greetingName} />}
      {role === "HR" && <HRDashboard greeting={greetingName} />}
      {role === "Employee" && <EmployeeDashboard greeting={greetingName} />}
    </div>
  );
}
