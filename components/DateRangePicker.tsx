"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, RotateCcw } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  showReset?: boolean;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  placeholder = "Filter by date range",
  className,
  showReset = true,
}: DateRangePickerProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-9 justify-start text-left font-normal border-zinc-200 bg-white min-w-[240px] shadow-sm rounded-lg",
              !dateRange && "text-zinc-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-zinc-500" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {showReset && dateRange && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDateRangeChange(undefined)}
          className="h-9 px-2 text-zinc-500 hover:text-zinc-900"
        >
          <RotateCcw className="h-4 w-4 mr-1.5" />
          Reset
        </Button>
      )}
    </div>
  );
}
