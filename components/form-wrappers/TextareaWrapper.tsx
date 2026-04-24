"use client";

import { Controller, FieldValues, Path } from "react-hook-form";
import type { Control, FieldError } from "react-hook-form";
import { Field, FieldLabel, FieldDescription, FieldError as FieldErrorComp } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { cn } from "@/lib/utils";

interface TextareaWrapperProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  description?: string;
  rows?: number;
}

export default function TextareaWrapper<T extends FieldValues>({
  control,
  name,
  label,
  className,
  placeholder,
  disabled = false,
  required = false,
  readonly = false,
  description,
  rows = 4,
}: TextareaWrapperProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>
            {required && <span className="text-red-500 mr-1">*</span>}
            {label}
          </FieldLabel>
          <div className="relative w-full">
            <Textarea
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder ?? `Enter ${label.toLowerCase()} details...`}
              className={cn(
                "min-h-[100px] rounded-md border-zinc-200 bg-white/70 focus-visible:ring-yellow-400/50 shadow-sm",
                className
              )}
              disabled={disabled}
              readOnly={readonly}
              rows={rows}
              onBlur={(e) => {
                field.onBlur();
                if (typeof e.target.value === "string") {
                  field.onChange(e.target.value.trim());
                }
              }}
            />
          </div>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && (
            <FieldErrorComp errors={[fieldState.error as FieldError]} />
          )}
        </Field>
      )}
    />
  );
}
