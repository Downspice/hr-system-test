"use client";

import { Controller, FieldValues, Path } from "react-hook-form";
import type { Control, FieldError } from "react-hook-form";
import { Field, FieldLabel, FieldDescription, FieldError as FieldErrorComp } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface InputWrapperProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  description?: string;
  autoComplete?: string;
}

export default function InputWrapper<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  className,
  placeholder,
  disabled = false,
  required = false,
  readonly = false,
  description,
  autoComplete = "off",
}: InputWrapperProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={type === "hidden" ? "hidden" : ""}>
          <FieldLabel htmlFor={field.name}>
            {required && <span className="text-red-500 mr-1">*</span>}
            {label}
          </FieldLabel>
          <Input
            {...field}
            id={field.name}
            type={type}
            aria-invalid={fieldState.invalid}
            placeholder={type === "number" ? "" : placeholder ?? `Enter ${label.toLowerCase()}`}
            className={className}
            disabled={disabled}
            readOnly={readonly}
            autoComplete={autoComplete}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && (
            <FieldErrorComp errors={[fieldState.error as FieldError]} />
          )}
        </Field>
      )}
    />
  );
}