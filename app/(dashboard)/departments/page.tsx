"use client";

import { useGetQuery } from "@/hooks/api-client";
import { Department } from "@/types/types";
import { DepartmentCard } from "@/components/DepartmentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { DepartmentDialog } from "@/components/DepartmentDialog";

export default function DepartmentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | undefined>();

  const { data: response, isLoading, isError, refetch } = useGetQuery<Department[]>(
    "departments",
    "/departments"
  );

  const departments = response?.data || [];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">
            Manage your organization's departments and their managers.
          </p>
        </div>
        <Button 
          className="gap-2" 
          onClick={() => {
            setSelectedDept(undefined);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add Department
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[140px] w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-destructive font-medium">Failed to load departments.</p>
          <Button variant="link" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      ) : departments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          {/* Illustration */}
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
                  d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                />
              </svg>
            </div>
            {/* Decorative dots */}
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-300/60" />
            <span className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-yellow-300/60" />
          </div>

          <h3 className="text-lg font-semibold text-zinc-800 mb-1">No departments yet</h3>
          <p className="text-sm text-zinc-400 max-w-xs mb-6">
            Start structuring your organisation by creating your first department. You can assign managers and employees afterwards.
          </p>

          <Button
            className="gap-2 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm px-5"
            onClick={() => {
              setSelectedDept(undefined);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Create first department
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {departments.map((dept) => (
            <DepartmentCard 
              key={dept.id} 
              department={dept} 
              onEdit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedDept(dept);
                setIsDialogOpen(true);
              }}
              onDelete={refetch}
            />
          ))}
        </div>
      )}

      <DepartmentDialog
        isOpen={isDialogOpen}
        department={selectedDept}
        onClose={() => setIsDialogOpen(false)}
        onRefresh={refetch}
      />
    </div>
  );
}
