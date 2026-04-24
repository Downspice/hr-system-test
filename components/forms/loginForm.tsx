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
      const response = await apiClient.post("/auth/login", data);
      
      const { token, user } = response.data;
      
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }
      
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      toast.success("Login successful!");
      router.push("/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || error.response?.data?.error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <InputWrapper
        control={control}
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        className="rounded-full bg-white/70 border-0 shadow-sm focus-visible:ring-2 focus-visible:ring-yellow-400/50"
        required
      />
      
      <InputWrapper
        control={control}
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        className="rounded-full bg-white/70 border-0 shadow-sm focus-visible:ring-2 focus-visible:ring-yellow-400/50"
        required
      />

      <Button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-[#facc15] hover:bg-[#eab308] text-black font-semibold h-12 mt-2 shadow-md">
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
