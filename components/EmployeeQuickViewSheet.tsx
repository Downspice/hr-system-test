"use client";

import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/types";
import { Mail, Briefcase, Shield, Calendar, X, ArrowRight, BadgeCent } from "lucide-react";
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
    {
      icon: <BadgeCent className="h-3.5 w-3.5" />,
      label: "Salary",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "GHS",
      }).format(employee.salary || 0),
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
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-white shadow-xl">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.username}`} />
              <AvatarFallback className="bg-zinc-800 text-white text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <span className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-white shadow-sm ${employee.isActive ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
          </div>
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
            <div className="space-y-4">
              {infoRows.map((row) => (
                <div key={row.label} className="group relative flex items-center">
                  <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-semibold  tracking-wider shrink-0 bg-white pr-2 z-10">
                    {row.icon}
                    <span>{row.label}</span>
                  </div>
                  <div className="flex-1 border-b border-dotted border-zinc-200 mt-1" />
                  <span className="text-[13px] font-medium text-zinc-800 pl-2 bg-white z-10">
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
            <div className="space-y-4">
              <div className="group relative flex items-center">
                <span className="text-[11px] font-semibold text-zinc-500  tracking-wider shrink-0 bg-white pr-2 z-10">System Role</span>
                <div className="flex-1 border-b border-dotted border-zinc-200 mt-1" />
                <span className="text-[13px] font-bold text-amber-600 pl-2 bg-white z-10">
                  {employee.role}
                </span>
              </div>
              <div className="group relative flex items-center">
                <span className="text-[11px] font-semibold text-zinc-500  tracking-wider shrink-0 bg-white pr-2 z-10">Account Status</span>
                <div className="flex-1 border-b border-dotted border-zinc-200 mt-1" />
                <span className={`text-[11px] font-bold  tracking-wider pl-2 bg-white z-10 ${employee.isActive ? 'text-emerald-600' : 'text-zinc-400'}`}>
                  {employee.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="group relative flex items-center">
                <span className="text-[11px] font-semibold text-zinc-500  tracking-wider shrink-0 bg-white pr-2 z-10">Username</span>
                <div className="flex-1 border-b border-dotted border-zinc-200 mt-1" />
                <span className="text-[13px] font-mono text-zinc-600 pl-2 bg-white z-10">@{employee.username}</span>
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
