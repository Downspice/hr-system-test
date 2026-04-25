"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AppTable } from "@/components/AppTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  Trash2,
  Search,
  Plus,
  Download,
  ChevronRight,
  SlidersHorizontal,
  Filter,
  ChevronLeft,
  Ban,
  UserCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User, Department } from "@/types/types";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { useGetQuery, useDynamicPatchMutation } from "@/hooks/api-client";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface EmployeeDataTableProps {
  data: User[];
  onView: (user: User) => void;
  onDelete: (user: User) => void;
  onCreate?: () => void;
  onRefresh?: () => void;
}

export function EmployeeDataTable({ data, onView, onDelete, onCreate, onRefresh }: EmployeeDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [isStatusDialogOpen, setIsStatusDialogOpen] = React.useState(false);
  const [userToToggle, setUserToToggle] = React.useState<User | null>(null);
  const statusMutation = useDynamicPatchMutation();

  const handleToggleStatus = async () => {
    if (!userToToggle) return;
    try {
      await statusMutation.mutateAsync({
        url: `/users/${userToToggle.id}/status`,
        payload: { isActive: !userToToggle.isActive }
      });
      toast.success(`User ${!userToToggle.isActive ? 'enabled' : 'disabled'} successfully`);
      setIsStatusDialogOpen(false);
      setUserToToggle(null);
      if (onRefresh) onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user status");
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      id: "fullName",
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      header: "Full name",
      cell: ({ row }) => {
        const user = row.original;
        const fullName = `${user.firstName} ${user.lastName}`;
        const initials = `${user.firstName[0]}${user.lastName[0]}`;
        return (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                <AvatarFallback className="bg-zinc-800 text-white text-xs font-bold">{initials}</AvatarFallback>
              </Avatar>
              <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${user.isActive ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm text-zinc-900">{fullName}</span>
              <span className="text-xs text-zinc-500">{user.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="text-sm text-zinc-700">{row.getValue("role")}</span>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "department",
      accessorFn: (row) => row.department?.name || "Unassigned",
      header: "Department",
      cell: ({ row }) => (
        <span className="text-sm text-zinc-600">{row.original.department?.name || "—"}</span>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "departmentRole",
      header: "Dept. Role",
      cell: ({ row }) => {
        const role = row.original.departmentRole;
        return role ? (
          <span className="text-sm text-zinc-600">{role.name}</span>
        ) : (
          <span className="text-sm text-zinc-400 italic">—</span>
        );
      },
    },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: ({ row }) => {
        const salary = row.original.salary || 0;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "GHS",
        }).format(salary);
        return <span className="text-sm font-medium text-zinc-700">{formatted}</span>;
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className={`h-1.5 w-1.5 rounded-full ${row.original.isActive ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
          <span className={`text-xs font-semibold ${row.original.isActive ? 'text-emerald-700' : 'text-zinc-500'}`}>
            {row.original.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      ),
    },
    {
      id: "isPresent",
      accessorFn: (row) => (row.isPresent || row.role === 'Admin' || row.role === 'HR') ? "Present" : "Absent",
      header: "Presence",
      cell: ({ row }) => {
        const isPresent = row.getValue("isPresent") === "Present";
        return (
          <div className="flex items-center gap-2">
            <div className={`h-1.5 w-1.5 rounded-full ${isPresent ? 'bg-blue-500 animate-pulse' : 'bg-zinc-300'}`} />
            <span className={`text-xs font-semibold ${isPresent ? 'text-blue-700' : 'text-zinc-500'}`}>
              {isPresent ? 'Present' : 'Absent'}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <span className="text-sm text-zinc-500">
            {date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onView(row.original)}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm"
            title="View profile"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setUserToToggle(row.original);
              setIsStatusDialogOpen(true);
            }}
            className={`inline-flex items-center justify-center h-8 w-8 rounded-lg transition-colors shadow-sm ${row.original.isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'} text-white`}
            title={row.original.isActive ? 'Disable user' : 'Enable user'}
            disabled={statusMutation.isPending}
          >
            {row.original.isActive ? <Ban className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
          </button>
          <button
            onClick={() => onDelete(row.original)}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
            title="Delete employee"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  const totalCount = table.getFilteredRowModel().rows.length;

  const { data: departmentsResponse } = useGetQuery<Department>("departments", "/departments");
  const departments = departmentsResponse?.data || [];

  const departmentOptions = departments.map((dept) => ({
    label: dept.name,
    value: dept.name,
  }));

  const roleOptions = [
    { label: "Admin", value: "Admin" },
    { label: "HR", value: "HR" },
    { label: "Employee", value: "Employee" },
  ];

  const presenceOptions = [
    { label: "Present", value: "Present" },
    { label: "Absent", value: "Absent" },
  ];

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Employee Management</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Manage your team members and their accounts</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 h-9 bg-white border-zinc-200 rounded-lg text-sm focus-visible:ring-zinc-400"
            />
          </div>
          
          <DataTableFacetedFilter
            column={table.getColumn("role")}
            title="Role"
            options={roleOptions}
          />

          <DataTableFacetedFilter
            column={table.getColumn("department")}
            title="Department"
            options={departmentOptions}
          />

          <DataTableFacetedFilter
            column={table.getColumn("isPresent")}
            title="Presence"
            options={presenceOptions}
          />

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-9 px-2 lg:px-3 text-sm text-zinc-500"
            >
              Reset
              <Plus className="ml-2 h-4 w-4 rotate-45" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="h-9 gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-sm"
            onClick={onCreate}
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <AppTable
          table={table}
          columnsLength={columns.length}
          headerClassName="bg-zinc-50"
          rowClassName="border-b border-zinc-50 hover:bg-zinc-50/80"
          cellClassName="px-4 py-3.5 h-[60px]"
          emptyState={
            <div className="h-32 flex items-center justify-center text-zinc-400 text-sm">
              No employees found.
            </div>
          }
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 px-1">
        <p className="text-sm text-zinc-500">
          Showing {totalCount} employee(s)
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 gap-1 border-zinc-200 text-zinc-600 text-sm"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 gap-1 border-zinc-200 text-zinc-600 text-sm"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={isStatusDialogOpen}
        onClose={() => {
          setIsStatusDialogOpen(false);
          setUserToToggle(null);
        }}
        onConfirm={handleToggleStatus}
        title={userToToggle?.isActive ? "Disable User Account" : "Enable User Account"}
        description={userToToggle?.isActive 
          ? `Are you sure you want to disable ${userToToggle.firstName}'s account? They will no longer be able to log in.`
          : `Are you sure you want to enable ${userToToggle?.firstName}'s account? They will regain access to the system.`
        }
        isDeleting={statusMutation.isPending}
        variant={userToToggle?.isActive ? "destructive" : "primary"}
        confirmText={userToToggle?.isActive ? "Disable Account" : "Enable Account"}
      />
    </div>
  );
}
