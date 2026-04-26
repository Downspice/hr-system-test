import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-[#f8f9f8] to-[#fffde7]">
      {/* Left side - Auth Form Container */}
      <div className="flex w-full flex-col justify-center px-8 sm:w-[50%] lg:px-16 xl:px-24">
        {/* Logo Area */}
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-white shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <polygon points="12 2 2 22 22 22"></polygon>
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-800">AWER</span>
        </div>

        {/* Dynamic Form Content */}
        <div className="mx-auto w-full max-w-sm">
          {children}
        </div>
      </div>

      {/* Right side - Image with Glassmorphism Mock */}
      <div className="hidden sm:flex sm:w-[50%] items-center justify-center p-4 lg:p-6">
        <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-zinc-100 shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2940&auto=format&fit=crop"
            alt="Modern Corporate Office"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute top-12 left-12 rounded-2xl bg-zinc-900/90 p-5 shadow-2xl backdrop-blur-md border border-white/10 animate-float">
            <div className="text-sm font-bold text-white mb-1">HR Performance Analytics</div>
            <div className="text-xs text-white/50">Real-time workforce monitoring</div>
          </div>
          
          <div className="absolute bottom-16 left-12 w-72 rounded-[2rem] bg-white/80 p-6 shadow-2xl backdrop-blur-xl border border-white/20 animate-float-slow">
            <div className="mb-2 text-sm font-bold text-zinc-900">Employee Management</div>
            <div className="text-xs text-zinc-500 font-medium">98.5% Organizational Efficiency</div>
            <div className="mt-4 flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-zinc-300 shadow-sm" />
              ))}
            </div>
          </div>

          <div className="absolute top-40 right-12 w-48 rounded-2xl bg-emerald-500/90 p-4 shadow-2xl backdrop-blur-md border border-white/10 animate-float-delayed">
            <div className="text-xs font-bold text-white mb-1 uppercase tracking-wider">Attendance</div>
            <div className="text-sm font-semibold text-white">96% Present Today</div>
          </div>

          <div className="absolute bottom-12 right-12 w-56 rounded-2xl bg-zinc-900/40 p-4 shadow-2xl backdrop-blur-xl border border-white/10 animate-float">
            <div className="text-xs font-bold text-white mb-1">Leave Requests</div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <div className="text-xs text-white/80">3 Pending Approvals</div>
            </div>
          </div>

          {/* New 4 Cards */}
          <div className="absolute top-1/2 left-8 -translate-y-1/2 w-44 rounded-2xl bg-blue-600/80 p-4 shadow-2xl backdrop-blur-lg border border-white/10 animate-float-slow">
            <div className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1 text-center">Payroll</div>
            <div className="text-sm font-bold text-white text-center">GHS 45,200.00</div>
            <div className="text-[10px] text-blue-200 text-center mt-1">Monthly Disbursement</div>
          </div>

          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-52 rounded-2xl bg-white/40 p-4 shadow-xl backdrop-blur-md border border-white/20 animate-float-delayed">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <div className="text-xs font-bold text-zinc-800">124 Active Members</div>
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">Full Employee Directory</div>
          </div>

          <div className="absolute bottom-40 right-24 w-40 rounded-2xl bg-zinc-800/80 p-4 shadow-2xl backdrop-blur-md border border-white/10 animate-float">
            <div className="text-xs font-bold text-white mb-1">Departments</div>
            <div className="text-[10px] text-white/60 leading-tight">8 Managed Groups</div>
          </div>

          <div className="absolute top-1/4 right-8 w-44 rounded-2xl bg-white/60 p-4 shadow-xl backdrop-blur-sm border border-white/30 animate-float-slow">
            <div className="text-xs font-bold text-zinc-900 mb-1">Roles & Access</div>
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-1.5 flex-1 rounded-full bg-zinc-300" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
