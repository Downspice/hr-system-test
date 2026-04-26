"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/types/types";
import { cn } from "@/lib/utils";

interface AppAvatarProps {
  user: Pick<User, "username" | "firstName" | "lastName" | "isActive">;
  className?: string;
  fallbackClassName?: string;
  showStatus?: boolean;
  statusClassName?: string;
}

export function AppAvatar({
  user,
  className,
  fallbackClassName,
  showStatus = false,
  statusClassName,
}: AppAvatarProps) {
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
  const seed = user.username || `${user.firstName}${user.lastName}`;

  return (
    <div className="relative inline-block">
      <Avatar className={cn("ring-2 ring-white shadow-sm", className)}>
        <AvatarImage 
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} 
          alt={`${user.firstName} ${user.lastName}`}
        />
        <AvatarFallback className={cn("bg-zinc-800 text-white font-bold", fallbackClassName)}>
          {initials}
        </AvatarFallback>
      </Avatar>
      
      {showStatus && (
        <span 
          className={cn(
            "absolute rounded-full border-2 border-white shadow-sm",
            user.isActive ? "bg-emerald-500" : "bg-zinc-400",
            statusClassName || "bottom-0 right-0 h-2.5 w-2.5"
          )} 
        />
      )}
    </div>
  );
}
