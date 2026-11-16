import LoginForm from "@/components/forms/loginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-4">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 p-1">
            <img
              src="/icon-square.png"
              alt="Ventos"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-800">
            AWER<span className="text-[#F97316]">.</span>
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-800">Welcome back</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Sign in to access your dashboard
        </p>
      </div>

      <LoginForm />

      <div className="flex items-center justify-between mt-8 text-xs text-zinc-500">
        <div>
          Don't have an account? <Link href="/signup" className="font-semibold text-zinc-800 underline-offset-4 hover:underline">Sign up</Link>
        </div>
        <Link href="#" className="hover:text-zinc-800 transition-colors">Terms & Conditions</Link>
      </div>
    </div>
  );
}
