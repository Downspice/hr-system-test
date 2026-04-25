"use client";

import React from "react";
import { flexRender, Table as TanStackTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface AppTableProps<TData> {
  table: TanStackTable<TData>;
  columnsLength: number;
  emptyState?: React.ReactNode;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
}

export function AppTable<TData>({
  table,
  columnsLength,
  emptyState,
  headerClassName,
  rowClassName,
  cellClassName,
}: AppTableProps<TData>) {
  return (
    <Table>
      <TableHeader className={cn("bg-zinc-50/50", headerClassName)}>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-transparent border-zinc-100">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="h-12 text-xs font-semibold text-zinc-500 uppercase tracking-wider px-6"
              >
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
              className={cn("hover:bg-zinc-50/30 transition-colors border-zinc-100", rowClassName)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className={cn("px-6 py-4", cellClassName)}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columnsLength} className="py-0">
              {emptyState || (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-sm text-zinc-500">No results found.</p>
                </div>
              )}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
