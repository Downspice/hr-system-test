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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  Trash2,
  Search,
  Plus,
  Download,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/types/types";

interface EmployeeDataTableProps {
  data: User[];
  onView: (user: User) => void;
  onDelete: (user: User) => void;
  onCreate?: () => void;
}

export function EmployeeDataTable({ data, onView, onDelete, onCreate }: EmployeeDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");

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
            <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
              <AvatarFallback className="bg-zinc-800 text-white text-xs font-bold">{initials}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm text-zinc-900">{fullName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <a href={`mailto:${row.getValue("email")}`} className="text-sm text-blue-600 hover:underline">
          {row.getValue("email")}
        </a>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="text-sm text-zinc-700">{row.getValue("role")}</span>
      ),
    },
    {
      id: "department",
      header: "Department",
      cell: ({ row }) => (
        <span className="text-sm text-zinc-600">{row.original.department?.name || "—"}</span>
      ),
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

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Employee Management</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Manage your team members and their accounts</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 h-9 bg-white border-zinc-200 rounded-lg text-sm focus-visible:ring-zinc-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 text-sm"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 text-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Columns
          </Button>
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
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-zinc-100 bg-zinc-50 hover:bg-zinc-50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-semibold text-zinc-500 uppercase tracking-wider h-11 px-4"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                  className="border-b border-zinc-50 hover:bg-zinc-50/80 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3.5 h-[60px]">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-zinc-400 text-sm">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
    </div>
  );
}
