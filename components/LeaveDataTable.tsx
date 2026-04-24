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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      accessorKey: "user",
      header: "Employee",
      cell: ({ row }) => {
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
      cell: ({ row }) => {
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

      <div className="rounded-[2rem] border border-zinc-100 bg-white shadow-xl shadow-zinc-200/20 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-zinc-100">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-12 text-xs font-semibold text-zinc-500 uppercase tracking-wider px-6">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-zinc-50/30 transition-colors border-zinc-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No leave requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
