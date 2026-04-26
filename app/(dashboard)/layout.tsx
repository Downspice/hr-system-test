"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Prevent flashing of dashboard content before redirecting
  if (!isAuthenticated) {
    return null; 
  }

  const getPageName = (path: string) => {
    if (path === "/") return "Dashboard";
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 0) return "Dashboard";
    
    const first = parts[0];
    return first.charAt(0).toUpperCase() + first.slice(1);
  };

  const pageName = getPageName(pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center gap-2">
            <span className="text-sm font-medium">{pageName}</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto min-w-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
