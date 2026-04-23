"use client";

import { Controller, FieldValues, Path } from "react-hook-form";
import type { Control, FieldError } from "react-hook-form";
import { Field, FieldLabel, FieldDescription, FieldError as FieldErrorComp } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

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
  size?: "sm" | "base" | "lg" | "xl";
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
  size = "base",
}: InputWrapperProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const currentType = isPassword ? (showPassword ? "text" : "password") : type;

  const sizeClasses = {
    sm: "h-8 text-xs px-2 py-1",
    base: "h-10 text-sm px-3 py-2 md:text-sm",
    lg: "h-12 text-base px-4 py-3",
    xl: "h-14 text-lg px-4 py-3",
  };

  const inputSizeClass = sizeClasses[size];

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
          <div className="relative w-full">
            <Input
              {...field}
              id={field.name}
              type={currentType}
              aria-invalid={fieldState.invalid}
              placeholder={type === "number" ? "" : placeholder ?? `Enter ${label.toLowerCase()}`}
              className={cn(inputSizeClass, className, isPassword && "pr-10")}
              disabled={disabled}
              readOnly={readonly}
              autoComplete={autoComplete}
            />
            {isPassword && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
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