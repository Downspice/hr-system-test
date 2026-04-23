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
import { Switch } from "@/components/ui/switch";

interface SwitchWrapperProps {
  control: Control<any>;
  name: string;
  label: string;
  description?: string;
  orientation?: "horizontal" | "vertical" | "responsive";
  disabled?: boolean;
  required?: boolean;
}

export default function SwitchWrapper({
  control,
  name,
  label,
  description,
  orientation = "horizontal",
  disabled = false,
  required = false,
}: SwitchWrapperProps) {
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
          <Switch
            id={id}
            name={field.name}
            checked={field.value}
            onCheckedChange={field.onChange}
            aria-invalid={fieldState.invalid}
            disabled={disabled}
          />
        </Field>
      )}
    />
  );
}
