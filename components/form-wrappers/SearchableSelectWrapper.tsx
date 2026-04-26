"use client";

import { useId, useState, useMemo } from "react";
import { Controller, FieldValues, Path } from "react-hook-form";
import type { Control, FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldDescription,
  FieldError as FieldErrorComp,
} from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Search } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectWrapperProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: SelectOption[];
  orientation?: "horizontal" | "vertical" | "responsive";
  placeholder?: string;
  searchPlaceholder?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  triggerClassName?: string;
  size?: "sm" | "base" | "lg" | "xl";
}

export default function SearchableSelectWrapper<T extends FieldValues>({
  control,
  name,
  label,
  options,
  orientation = "responsive",
  placeholder = "Select",
  searchPlaceholder = "Search...",
  description,
  disabled = false,
  required = false,
  triggerClassName = "w-full",
  size = "base",
}: SearchableSelectWrapperProps<T>) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const sizeClasses = {
    sm: "h-8 text-xs px-2 py-1",
    base: "h-10 text-sm px-3 py-2",
    lg: "h-12 text-base px-4 py-3",
    xl: "h-14 text-lg px-4 py-3",
  };

  const triggerSizeClass = sizeClasses[size];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedOption = options.find((opt) => opt.value === field.value);

        return (
          <Field orientation={orientation} data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={id}>
                {required && <span className="text-red-500 mr-1">*</span>}
                {label}
              </FieldLabel>
              {description && (
                <FieldDescription>{description}</FieldDescription>
              )}
              {fieldState.invalid && (
                <FieldErrorComp errors={[fieldState.error as FieldError]} />
              )}
            </FieldContent>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  id={id}
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={disabled}
                  className={cn(
                    triggerSizeClass,
                    "justify-between font-normal bg-white border-zinc-200 hover:bg-zinc-50 transition-colors",
                    !field.value && "text-zinc-500",
                    triggerClassName
                  )}
                >
                  <span className="truncate">
                    {selectedOption ? selectedOption.label : placeholder}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
                <div className="flex items-center border-b px-3 bg-zinc-50/50">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <input
                    className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto p-1">
                  {filteredOptions.length === 0 ? (
                    <div className="py-6 text-center text-sm text-zinc-500">
                      No options found.
                    </div>
                  ) : (
                    filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={cn(
                          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-zinc-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-left",
                          field.value === option.value && "bg-zinc-50 font-medium"
                        )}
                        onClick={() => {
                          field.onChange(option.value);
                          setOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          {field.value === option.value && (
                            <Check className="h-4 w-4" />
                          )}
                        </span>
                        {option.label}
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </Field>
        );
      }}
    />
  );
}
