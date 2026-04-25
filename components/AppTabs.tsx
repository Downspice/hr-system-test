"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  count?: number;
}

interface AppTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
  tabsListClassName?: string;
}

export function AppTabs({ tabs, defaultValue, className, tabsListClassName }: AppTabsProps) {
  return (
    <Tabs defaultValue={defaultValue || tabs[0]?.id} className={cn("w-full", className)}>
      <TabsList className={cn("bg-zinc-100/80 p-1 rounded-xl mb-6", tabsListClassName)}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="rounded-lg px-4 py-2 data-active:bg-white data-active:shadow-sm data-active:text-zinc-900 text-zinc-500 font-medium transition-all gap-2"
          >
            {tab.icon && <span className="h-4 w-4">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                "ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                "bg-zinc-200 text-zinc-600 group-data-active:bg-zinc-900 group-data-active:text-white"
              )}>
                {tab.count}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="focus-visible:outline-none">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
