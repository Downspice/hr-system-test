import SignUpForm from "@/components/forms/SignUpForm";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-800">Create an account</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Sign up and get 30 day free trial
        </p>
      </div>

      <SignUpForm />

      <div className="flex items-center justify-between mt-8 text-xs text-zinc-500">
        <div>
          Have any account? <Link href="/login" className="font-semibold text-zinc-800 underline-offset-4 hover:underline">Sign in</Link>
        </div>
        <Link href="#" className="hover:text-zinc-800 transition-colors">Terms & Conditions</Link>
      </div>
    </div>
  );
}
