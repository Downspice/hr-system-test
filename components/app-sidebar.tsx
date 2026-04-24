"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/axios"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Briefcase,
  Search,
  Settings,
  LogOut,
  ChevronRight,
  MoreHorizontal,
  Home,
  CheckCircle2,
  UserCog,
  User,
  CalendarOff,
  Clock,
  PieChart,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmployeeViewDialog } from "@/components/EmployeeViewDialog"
import { useGetQuery } from "@/hooks/api-client"
import { User as UserType } from "@/types/types"

type NavItem = {
  title: string;
  url: string;
  icon: any;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};

const data: {
  user: { name: string; email: string; avatar: string };
  navMain: NavItem[];
  secondary: { title: string; url: string; icon: any }[];
} = {
  user: {
    name: "Joe HR",
    email: "joe@example.com",
    avatar: "/avatars/joe.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Employees",
      url: "/employees",
      icon: Users,
      items: [],
    },
    {
      title: "Department",
      url: "/departments",
      icon: Briefcase,
      items: [],
    },
    {
      title: "Roles",
      url: "/roles",
      icon: UserCog,
      items: [],
    },
    {
      title: "Leaves",
      url: "/leaves",
      icon: CalendarOff,
      items: [],
    },
    {
      title: "Attendance",
      url: "/attendance",
      icon: Clock,
      items: [],
    },
  ],
  secondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const [currentUser, setCurrentUser] = React.useState<any>(null)
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)

  const { data: profileResponse } = useGetQuery<UserType>(
    ["user-profile"],
    "/auth/me",
    { enabled: !!currentUser }
  )

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser))
        } catch (e) {
          console.error("Failed to parse user from localStorage")
        }
      }
    }
  }, [])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
    delete apiClient.defaults.headers.common["Authorization"]
    router.push("/login") // Adjust this to your actual login route if different
  }

  const role = currentUser?.role || "Employee" // Default fallback

  const navMain = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
      roles: ["Admin", "HR", "Employee"],
    },
    {
      title: "Employees",
      url: "/employees",
      icon: Users,
      roles: ["Admin", "HR"],
    },
    {
      title: "My Profile",
      url: "/profile",
      icon: Users,
      roles: ["Employee"],
    },
    {
      title: "Department",
      url: "/departments",
      icon: Briefcase,
      roles: ["Admin"],
    },
    {
      title: "Roles",
      url: "/roles",
      icon: UserCog,
      roles: ["Admin"],
    },
    {
      title: "Leaves",
      url: "/leaves",
      icon: CalendarOff,
      roles: ["Admin", "HR", "Employee"],
    },
    {
      title: "Attendance",
      url: "/attendance",
      icon: Clock,
      roles: ["Admin", "HR", "Employee"],
    },
  ].filter((item) => item.roles.includes(role))

  const secondary = [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ]

  const userData = {
    name: currentUser?.firstName 
      ? `${currentUser.firstName} ${currentUser.lastName}` 
      : currentUser?.username || "Guest",
    email: currentUser?.email || "guest@example.com",
    avatar: currentUser?.avatar || "",
    role: role,
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Users className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">HR System</span>
                <span className="text-xs text-muted-foreground">{userData.role}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            {navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {secondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="sm">
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback className="rounded-lg">{userData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userData.name}</span>
                    <span className="truncate text-xs">{userData.email}</span>
                  </div>
                  <MoreHorizontal className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback className="rounded-lg">{userData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{userData.name}</span>
                      <span className="truncate text-xs">{userData.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsProfileOpen(true)} className="cursor-pointer">
                  <User className="mr-2 size-4" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
      <EmployeeViewDialog
        isOpen={isProfileOpen}
        employee={profileResponse?.data as any}
        onClose={() => setIsProfileOpen(false)}
      />
    </Sidebar>
  )
}
