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
          <span className="text-lg font-bold tracking-tight text-zinc-800">CREXTIO</span>
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
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop"
            alt="Team Collaboration"
            fill
            className="object-cover"
            priority
          />
          {/* Subtle Glassmorphism overlays to match the vibe */}
          <div className="absolute top-12 left-12 rounded-2xl bg-yellow-400/95 p-4 shadow-lg backdrop-blur-sm">
            <div className="text-sm font-semibold text-black/80">Task Review With Team</div>
            <div className="text-xs text-black/60">09:30am - 10:00am</div>
          </div>
          
          <div className="absolute bottom-16 left-12 w-64 rounded-2xl bg-white/80 p-5 shadow-2xl backdrop-blur-xl border border-white/20">
            <div className="mb-2 text-sm font-semibold text-zinc-800">Daily Meeting</div>
            <div className="text-xs text-zinc-500">12:00pm - 01:00pm</div>
            <div className="mt-4 flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-zinc-300 shadow-sm" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
