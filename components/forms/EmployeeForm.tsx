"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InputWrapper from "@/components/form-wrappers/InputWrapper";
import SelectWrapper from "@/components/form-wrappers/SelectWrapper";
import { Button } from "@/components/ui/button";
import { useGetQuery, usePostMutation, usePutMutation } from "@/hooks/api-client";
import { User, Role, Department, DepartmentRole } from "@/types/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const employeeSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().optional(),
  role: z.enum(["Admin", "HR", "Employee"] as const),
  departmentId: z.string().optional(),
  departmentRoleId: z.string().optional(),
}).refine((data) => {
  // Password is required for new employees, optional for updates
  return true; // We'll handle validation in the component if needed, or just let the backend handle it
}, {
  message: "Password is required for new employees",
  path: ["password"],
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  initialData?: User;
  onSuccess: () => void;
}

export default function EmployeeForm({ initialData, onSuccess }: EmployeeFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { isSubmitting },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      username: initialData?.username || "",
      password: "",
      role: initialData?.role || "Employee",
      departmentId: initialData?.department?.id || "",
      departmentRoleId: initialData?.departmentRole?.id || "",
    },
  });

  const selectedDeptId = watch("departmentId");

  // Fetch departments
  const { data: deptResponse } = useGetQuery<Department>("departments", "/departments");
  
  // Fetch department roles for the selected department
  const { data: rolesResponse } = useGetQuery<DepartmentRole>(
    ["department-roles", selectedDeptId],
    `/departments/${selectedDeptId}/roles`,
    { enabled: !!selectedDeptId }
  );

  const createMutation = usePostMutation<User, EmployeeFormValues>("/users");
  const updateMutation = usePutMutation<User, EmployeeFormValues>(
    initialData ? `/users/${initialData.id}` : ""
  );

  const onSubmit = async (data: EmployeeFormValues) => {
    // Manual validation for password on create
    if (!initialData && !data.password) {
      setError("password", { message: "Password is required for new employees" });
      return;
    }

    try {
      const submitData = { ...data };
      if (initialData && !submitData.password) {
        delete submitData.password;
      }

      if (initialData) {
        await updateMutation.mutateAsync(submitData);
        toast.success("Employee updated successfully");
      } else {
        await createMutation.mutateAsync(submitData);
        toast.success("Employee registered successfully");
      }
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || "Failed to save employee");
    }
  };

  const departmentOptions = deptResponse?.data?.map(d => ({ label: d.name, value: d.id })) || [];
  const roleOptions = rolesResponse?.data?.map(r => ({ label: r.name, value: r.id })) || [];
  const systemRoleOptions = [
    { label: "Admin", value: "Admin" },
    { label: "HR", value: "HR" },
    { label: "Employee", value: "Employee" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <InputWrapper control={control} name="firstName" label="First Name" required />
        <InputWrapper control={control} name="lastName" label="Last Name" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputWrapper control={control} name="email" label="Email" type="email" required />
        <InputWrapper control={control} name="username" label="Username" required />
      </div>
      
      {!initialData && (
        <InputWrapper 
          control={control} 
          name="password" 
          label="Password" 
          type="password" 
          required 
          placeholder="Minimum 8 characters"
        />
      )}

      <SelectWrapper
        control={control}
        name="role"
        label="System Role"
        options={systemRoleOptions}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <SelectWrapper
          control={control}
          name="departmentId"
          label="Department"
          options={departmentOptions}
        />
        <SelectWrapper
          control={control}
          name="departmentRoleId"
          label="Department Role"
          options={roleOptions}
          disabled={!selectedDeptId}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting} className="rounded-full px-8">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Employee" : "Register Employee"}
        </Button>
      </div>
    </form>
  );
}
