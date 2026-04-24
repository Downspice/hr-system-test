"use client";

import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/types";
import { Mail, Briefcase, Shield, Calendar, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmployeeQuickViewSheetProps {
  employee?: User;
  isOpen: boolean;
  onClose: () => void;
}

export function EmployeeQuickViewSheet({ employee, isOpen, onClose }: EmployeeQuickViewSheetProps) {
  const router = useRouter();

  if (!employee) return null;

  const fullName = `${employee.firstName} ${employee.lastName}`;
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

  const infoRows = [
    {
      icon: <Mail className="h-3.5 w-3.5" />,
      label: "E-Mail",
      value: employee.email,
    },
    {
      icon: <Briefcase className="h-3.5 w-3.5" />,
      label: "Department",
      value: employee.department?.name || "Not Assigned",
    },
    {
      icon: <Shield className="h-3.5 w-3.5" />,
      label: "Dept. Role",
      value: employee.departmentRole?.name || "Not Assigned",
    },
    {
      icon: <Calendar className="h-3.5 w-3.5" />,
      label: "Date Joined",
      value: new Date(employee.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[380px] sm:max-w-[380px] p-0 overflow-hidden flex flex-col gap-0 border-l border-zinc-200 bg-white shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Hero header */}
        <div className="relative bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-300 px-6 pt-10 pb-6 flex flex-col items-center">
          <Avatar className="h-24 w-24 ring-4 ring-white shadow-xl">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.username}`} />
            <AvatarFallback className="bg-zinc-800 text-white text-2xl font-bold">{initials}</AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-xl font-bold text-zinc-900">{fullName}</h2>
          <p className="text-sm text-zinc-700 mt-0.5">{employee.role}</p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-3">
              Basic Information
            </h3>
            <div className="space-y-0 divide-y divide-zinc-100 border border-zinc-100 rounded-xl overflow-hidden">
              {infoRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between px-4 py-3 bg-white hover:bg-zinc-50/60 transition-colors">
                  <div className="flex items-center gap-2 text-zinc-500 text-xs">
                    {row.icon}
                    <span>{row.label}</span>
                  </div>
                  <span className="text-xs font-medium text-zinc-800 text-right max-w-[180px] truncate">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Leave Summary */}
          <div>
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-3">
              Role Information
            </h3>
            <div className="rounded-xl border border-zinc-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-white">
                <span className="text-xs text-zinc-500">System Role</span>
                <span className="text-xs font-semibold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded-full">
                  {employee.role}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-zinc-100">
                <span className="text-xs text-zinc-500">Username</span>
                <span className="text-xs font-mono text-zinc-600">@{employee.username}</span>
              </div>
            </div>
          </div>
        </div>

        {/* View Full Profile Button */}
        <div className="px-6 py-4 border-t border-zinc-100 bg-white">
          <Button
            onClick={() => {
              onClose();
              router.push(`/employees/${employee.id}`);
            }}
            className="w-full bg-amber-400 hover:bg-amber-500 text-zinc-900 font-semibold gap-2 h-11 rounded-xl shadow-sm transition-all"
          >
            View Full Profile
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
