"use client";

import { useId } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectWrapperProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: SelectOption[];
  orientation?: "horizontal" | "vertical" | "responsive";
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  triggerClassName?: string;
  size?: "sm" | "base" | "lg" | "xl";
}

export default function SelectWrapper<T extends FieldValues>({
  control,
  name,
  label,
  options,
  orientation = "responsive",
  placeholder = "Select",
  description,
  disabled = false,
  required = false,
  triggerClassName = "min-w-[120px]",
  size = "base",
}: SelectWrapperProps<T>) {
  const id = useId();

  const sizeClasses = {
    sm: "h-8 text-xs px-2 py-1",
    base: "h-10 text-sm px-3 py-2 md:text-sm",
    lg: "h-12 text-base px-4 py-3",
    xl: "h-14 text-lg px-4 py-3",
  };

  const selectSizeClass = sizeClasses[size];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
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
          <Select
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger
              id={id}
              aria-invalid={fieldState.invalid}
              className={cn(selectSizeClass, triggerClassName)}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
}
