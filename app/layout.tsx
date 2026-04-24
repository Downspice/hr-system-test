import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const nunitoSans = Nunito_Sans({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import QueryProvider from "@/context/TankStackProvider";

export const metadata = {
  title: "HR System",
  description: "HR Management System",
};

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
        <QueryProvider>

          <ThemeProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </ThemeProvider>
          <Toaster richColors={true} />
        </QueryProvider>

      </body>
    </html>
  )
}
