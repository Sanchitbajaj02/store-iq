import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getTotalLocations } from "@/lib/db/queries";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locationCount } = await getTotalLocations();

  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full">
        <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background">
          <DashboardHeader locationCount={locationCount} />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
