"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Sidebar,
  SidebarContent,
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "../theme-toggle";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import type { User } from "@supabase/supabase-js";

const navItems = [
  {
    id: "home",
    title: "Home",
    icon: null,
    link: "/",
  },
  {
    id: "about",
    title: "About",
    icon: null,
    link: "/",
  },
  {
    id: "contact",
    title: "Contact",
    icon: null,
    link: "/",
  },
];

const SidebarComponent = ({
  toggleSidebar,
  user,
}: {
  toggleSidebar: () => void;
  user: User | null;
}) => {
  return (
    <Sidebar className="py-4 px-4">
      <SidebarHeader className="mb-4 ml-auto">
        <Button
          variant="default"
          size="icon"
          className="cursor-pointer bg-neutral-800 dark:hover:bg-neutral-900"
          onClick={() => toggleSidebar()}
        >
          <XIcon size={24} color="white" />
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="gap-4 px-4">
          {navItems.map((cert, i) => (
            <SidebarMenuItem key={i}>
              <Link
                href={"/"}
                className="text-neutral-800 dark:text-white/80 hover:text-neutral-900 dark:hover:text-white text-sm transition-colors"
              >
                {cert.title}
              </Link>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem className="mb-4">
            <Button
              asChild
              variant={"outline"}
              className={cn(
                "rounded-full bg-accent hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Link href={user ? "/dashboard" : "/login"} className="text-base">
                {user ? "Dashboard" : "Signin"}
              </Link>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

const Header = () => {
  const { toggleSidebar } = useSidebar();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="py-4 fixed w-full top-0 z-50">
      <SidebarComponent toggleSidebar={toggleSidebar} user={user} />
      <div className="max-w-6xl mx-auto blur-in-lg">
        <div
          className={cn(
            "flex flex-row items-center justify-between rounded-full py-2 px-4 lg:px-2 transition-colors mx-2 lg:mx-0 backdrop-blur-lg shadow"
          )}
        >
          {/* Logo */}
          <Link href="/" className="mx-2 relative">
            <p className="font-bold text-neutral-900 dark:text-white text-2xl">
              Store IQ
            </p>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navItems &&
              navItems.length > 0 &&
              navItems.map((navItem) => {
                return (
                  <Link
                    key={navItem.id}
                    href={navItem.link}
                    className="text-neutral-800 dark:text-white/80 hover:text-neutral-900 dark:hover:text-white text-base flex flex-row items-center gap-2"
                  >
                    {navItem.title} {navItem.icon}
                  </Link>
                );
              })}

            <Button
              asChild
              variant={"outline"}
              className={cn(
                "rounded-full bg-accent hover:bg-accent hover:text-accent-foreground mx-2"
              )}
            >
              <Link href={user ? "/dashboard" : "/login"} className="text-base">
                {user ? "Dashboard" : "Signin"}
              </Link>
            </Button>

            <ThemeToggle />
          </nav>

          <div className="block lg:hidden mx-2 space-x-4">
            <ThemeToggle />

            <Button
              variant="default"
              size="icon"
              className="cursor-pointer bg-neutral-800 dark:hover:bg-neutral-900"
              onClick={() => toggleSidebar()}
            >
              <Menu size={24} color="white" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
