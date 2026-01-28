"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export function DashboardHeader({ locationCount }: { locationCount: number }) {
  return (
    <div className="w-full sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-3 py-2.5 sm:px-4 sm:py-3 md:px-7">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <SidebarTrigger className="shrink-0" />
        <h1 className="text-base sm:text-xl md:text-2xl font-medium text-foreground truncate">
          Store IQ - Location Intelligence
        </h1>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
        <span className="hidden md:inline text-sm text-muted-foreground">
          {locationCount} Healthcare Stores
        </span>
        <ThemeToggle />
      </div>
    </div>
  );
}
