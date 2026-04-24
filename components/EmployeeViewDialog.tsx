"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, User as UserIcon, Briefcase, ShieldCheck } from "lucide-react";

interface EmployeeViewDialogProps {
  employee?: User;
  isOpen: boolean;
  onClose: () => void;
}

export function EmployeeViewDialog({ employee, isOpen, onClose }: EmployeeViewDialogProps) {
  if (!employee) return null;

  const fullName = `${employee.firstName} ${employee.lastName}`;
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <div className="bg-zinc-900 p-8 flex flex-col items-center text-white relative">
           <Avatar className="h-24 w-24 border-4 border-zinc-800 shadow-xl mb-4">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.username}`} />
              <AvatarFallback className="bg-zinc-700 text-2xl">{initials}</AvatarFallback>
           </Avatar>
           <h2 className="text-2xl font-bold">{fullName}</h2>
           <p className="text-zinc-400 text-sm">@{employee.username}</p>
           <Badge variant="success" className="mt-4 bg-[#facc15] text-black hover:bg-[#facc15]/90 border-none">
              {employee.role}
           </Badge>
        </div>
        
        <div className="p-8 space-y-6 bg-white">
           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                 <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase tracking-wider">
                    <Mail className="h-3 w-3" /> Email Address
                 </div>
                 <p className="text-sm font-medium">{employee.email}</p>
              </div>
              <div className="space-y-1">
                 <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase tracking-wider">
                    <Briefcase className="h-3 w-3" /> Department
                 </div>
                 <p className="text-sm font-medium">{employee.department?.name || "N/A"}</p>
              </div>
              <div className="space-y-1">
                 <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase tracking-wider">
                    <ShieldCheck className="h-3 w-3" /> Dept. Role
                 </div>
                 <p className="text-sm font-medium">{employee.departmentRole?.name || "N/A"}</p>
              </div>
              <div className="space-y-1">
                 <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase tracking-wider">
                    <Calendar className="h-3 w-3" /> Joined Date
                 </div>
                 <p className="text-sm font-medium">{new Date(employee.createdAt).toLocaleDateString()}</p>
              </div>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
