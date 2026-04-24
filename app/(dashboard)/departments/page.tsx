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

  const { data: response, isLoading, isError, refetch } = useGetQuery<Department>(
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
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl">
          <p className="text-muted-foreground">No departments found.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSelectedDept(undefined);
              setIsDialogOpen(true);
            }}
          >
            Create your first department
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
