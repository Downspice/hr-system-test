"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InputWrapper from "@/components/form-wrappers/InputWrapper";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Adjust the URL if your login endpoint is different
      const response = await apiClient.post("/auth/login", data);
      
      const { token, user } = response.data;
      
      // Store token and user data in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }
      
      // Update default headers for subsequent requests immediately
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      toast.success("Login successful!");
      router.push("/dashboard"); // Adjust to your default post-login route
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || error.response?.data?.error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm">
      <InputWrapper
        control={control}
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        required
      />
      
      <InputWrapper
        control={control}
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        required
      />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
