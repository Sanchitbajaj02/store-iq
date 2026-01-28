"use client";

import {
  Search,
  LayoutDashboard,
  MapPin,
  MessageSquareText,
  BarChart3,
  Settings,
  HelpCircle,
  LogOutIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Locations", href: "/dashboard/locations", icon: MapPin },
  { label: "Reviews", href: "/dashboard/reviews", icon: MessageSquareText },
  { label: "Performance", href: "/dashboard/performance", icon: BarChart3 },
];

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <Sidebar className="lg:border-r-0!" collapsible="offcanvas" {...props}>
      <SidebarHeader className="pb-0">
        <div className="px-2 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6 bg-linear-to-br from-blue-500 to-cyan-600 rounded-sm shadow flex items-center justify-center text-white text-xs font-semibold">
                SIQ
              </div>
              <span className="font-semibold">Store IQ</span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/avatar.png"
                alt="User"
                className="size-5 object-cover rounded-full"
                width={20}
                height={20}
              />
            </div>
          </div>

          <div className="mt-4 relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground z-10" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 pr-8 h-8 text-sm text-muted-foreground placeholder:text-muted-foreground tracking-[-0.42px] bg-background"
            />
            <div className="flex items-center gap-0.5 rounded border border-border bg-sidebar px-1.5 py-0.5 shrink-0 absolute right-2 top-1/2 -translate-y-1/2">
              <span className="text-[10px] font-medium text-muted-foreground leading-none tracking-[-0.1px]">
                ⌘
              </span>
              <Kbd className="h-auto min-w-0 px-0 py-0 text-[10px] leading-none tracking-[-0.1px] bg-transparent border-0">
                K
              </Kbd>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      className="h-7 text-sm text-muted-foreground"
                    >
                      <Link href={item.href}>
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-7 text-sm text-muted-foreground">
              <Settings className="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-7 text-sm text-muted-foreground">
              <HelpCircle className="size-4" />
              <span>Help Center</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-7 text-sm text-muted-foreground">
              <LogOutIcon className="size-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
