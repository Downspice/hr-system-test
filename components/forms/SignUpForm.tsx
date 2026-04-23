"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InputWrapper from "@/components/form-wrappers/InputWrapper";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      const { confirmPassword, ...submitData } = data;

      const response = await apiClient.post("/users", submitData);

      toast.success("Account created successfully! Please log in.");

      router.push("/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || error.response?.data?.error || "Signup failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
      <div className="grid grid-cols-2 gap-4">
        <InputWrapper
          control={control}
          name="firstName"
          label="First Name"
          placeholder="John"
          required
        />
        <InputWrapper
          control={control}
          name="lastName"
          label="Last Name"
          placeholder="Doe"
          required
        />
      </div>

      <InputWrapper
        control={control}
        name="username"
        label="Username"
        placeholder="johndoe123"
        required
      />

      <InputWrapper
        control={control}
        name="email"
        label="Email"
        type="email"
        placeholder="johndoe@example.com"
        required
      />
      
      <InputWrapper
        control={control}
        name="password"
        label="Password"
        type="password"
        placeholder="Enter a strong password"
        description="Must be at least 8 characters, with uppercase, lowercase, number, and special character."
        required
      />

      <InputWrapper
        control={control}
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Re-enter your password"
        required
      />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  );
}
