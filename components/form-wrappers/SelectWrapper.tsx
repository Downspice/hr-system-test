"use client";

import { useId } from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldError } from "react-hook-form";
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

interface SelectWrapperProps {
  control: Control<any>;
  name: string;
  label: string;
  options: SelectOption[];
  orientation?: "horizontal" | "vertical" | "responsive";
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  triggerClassName?: string;
}

export default function SelectWrapper({
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
}: SelectWrapperProps) {
  const id = useId();

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
              className={triggerClassName}
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
