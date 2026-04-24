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
  Clock
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
import { Attendance, Role } from "@/types/types";

interface AttendanceDataTableProps {
  data: Attendance[];
  role: Role;
}

export function AttendanceDataTable({ data, role }: AttendanceDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const isAdmin = role === "Admin" || role === "HR";

  const columns: ColumnDef<Attendance>[] = [
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
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        return <span className="text-sm font-medium">{date.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>;
      },
    },
    {
      accessorKey: "checkIn",
      header: "Check In",
      cell: ({ row }) => {
        const checkIn = new Date(row.getValue("checkIn"));
        return (
          <div className="flex items-center gap-1.5 text-emerald-700">
             <span className="text-sm font-semibold">{checkIn.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "checkOut",
      header: "Check Out",
      cell: ({ row }) => {
        const checkOutValue = row.getValue("checkOut");
        if (!checkOutValue) {
           return <span className="text-sm text-zinc-400 italic">Ongoing</span>;
        }
        const checkOut = new Date(checkOutValue as string);
        return (
          <div className="flex items-center gap-1.5 text-amber-600">
             <span className="text-sm font-semibold">{checkOut.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "totalHours",
      header: "Total Hours",
      cell: ({ row }) => {
        const hours = row.getValue("totalHours") as number | null;
        if (hours === null) {
          return <Badge variant="outline" className="text-zinc-500 border-zinc-200 shadow-none"><Clock className="w-3 h-3 mr-1"/> Active</Badge>;
        }
        return <span className="text-sm font-bold text-zinc-900">{hours} hrs</span>;
      },
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
        pagination: {
            pageSize: 10
        }
    }
  });

  return (
    <div className="w-full space-y-4">
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
                <TableCell colSpan={columns.length} className="py-0">
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="relative mb-5">
                      <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 flex items-center justify-center shadow-sm">
                        <Clock className="h-10 w-10 text-zinc-400" />
                      </div>
                    </div>
                    <p className="text-base font-semibold text-zinc-700">No attendance records found</p>
                    <p className="text-sm text-zinc-400 mt-1 max-w-xs">
                      {isAdmin
                        ? "No employee attendance records exist yet."
                        : "You haven't checked in yet."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 py-4">
        <p className="text-sm text-zinc-500">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
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
