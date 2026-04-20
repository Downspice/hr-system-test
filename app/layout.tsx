import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const nunitoSans = Nunito_Sans({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", nunitoSans.variable)}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <div className="flex flex-1 items-center gap-2">
                    <span className="text-sm font-medium">Dashboard</span>
                  </div>
                </header>
                <main className="flex-1 overflow-auto">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
