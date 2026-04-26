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
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppTable } from "@/components/AppTable";
import { Badge } from "@/components/ui/badge";
import { Leave, LeaveStatus, Role } from "@/types/types";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LeaveDataTableProps {
  data: Leave[];
  role: Role;
  onAction?: (leave: Leave, status: LeaveStatus) => void;
}

export function LeaveDataTable({ data, role, onAction }: LeaveDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const isAdmin = role === "Admin" || role === "HR";

  const columns: ColumnDef<Leave>[] = [
    ...(isAdmin ? [{
      id: "user",
      accessorFn: (row: any) => `${row.user?.firstName} ${row.user?.lastName}`,
      header: "Employee",
      cell: ({ row }: { row: any }) => {
        const user = row.original.user;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-zinc-900">{user?.firstName} {user?.lastName}</span>
            <span className="text-xs text-zinc-500">{user?.email}</span>
          </div>
        );
      },
    }] : []),
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate text-sm text-zinc-600" title={row.getValue("reason")}>
          {row.getValue("reason")}
        </div>
      ),
    },
    {
      accessorKey: "startDate",
      header: "From",
      cell: ({ row }) => {
        const date = new Date(row.getValue("startDate"));
        return <span className="text-sm font-medium">{date.toLocaleDateString()}</span>;
      },
    },
    {
      accessorKey: "endDate",
      header: "To",
      cell: ({ row }) => {
        const date = new Date(row.getValue("endDate"));
        return <span className="text-sm font-medium">{date.toLocaleDateString()}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as LeaveStatus;
        const variants: Record<LeaveStatus, { color: string, icon: any }> = {
          PENDING: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
          APPROVED: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
          REJECTED: { color: "bg-rose-100 text-rose-700 border-rose-200", icon: XCircle },
        };
        const config = variants[status];
        const Icon = config.icon;

        return (
          <div className="flex flex-col gap-1">
            <Badge className={cn("px-2.5 py-0.5 rounded-full font-medium border shadow-none w-fit", config.color)}>
              <Icon className="mr-1.5 h-3 w-3" />
              {status}
            </Badge>
            {row.original.adminNote && (
              <span className="text-[10px] text-zinc-500 italic max-w-[150px] truncate" title={row.original.adminNote}>
                Note: {row.original.adminNote}
              </span>
            )}
          </div>
        );
      },
    },
    ...(isAdmin ? [{
      id: "actions",
      cell: ({ row }: { row: any }) => {
        const leave = row.original;
        if (leave.status !== "PENDING") return null;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              onClick={() => onAction?.(leave, "APPROVED")}
            >
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-full border-rose-200 text-rose-700 hover:bg-rose-50"
              onClick={() => onAction?.(leave, "REJECTED")}
            >
              Reject
            </Button>
          </div>
        );
      },
    }] : []),
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 5
      }
    }
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reasons..."
            value={(table.getColumn("reason")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("reason")?.setFilterValue(event.target.value)
            }
            className="h-10 w-full rounded-full border-zinc-200 bg-white pl-10 focus-visible:ring-yellow-400/50"
          />
        </div>
      </div>

      <div className="rounded-md border border-zinc-100 bg-white shadow-xl shadow-zinc-200/20 overflow-hidden">
        <AppTable
          table={table}
          columnsLength={columns.length}
          emptyState={
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-5">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center shadow-sm">
                  <svg
                    className="h-10 w-10 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                </div>
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-amber-200" />
              </div>
              <p className="text-base font-semibold text-zinc-700">No leave requests found</p>
              <p className="text-sm text-zinc-400 mt-1 max-w-xs">
                {isAdmin
                  ? "No employee leave requests have been submitted yet."
                  : "You haven't submitted any leave requests yet."}
              </p>
            </div>
          }
        />
      </div>

      <div className="flex items-center justify-between px-2 py-4">
        <p className="text-sm text-zinc-500">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-9 w-9 rounded-full p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-9 w-9 rounded-full p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
