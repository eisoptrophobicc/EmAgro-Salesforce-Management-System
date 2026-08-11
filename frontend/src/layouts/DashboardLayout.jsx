import {
  LayoutDashboard,
  Users,
  UserRound,
  ClipboardCheck,
  ClipboardList,
  FileBarChart,
  LogOut,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";

import { useAuth } from "@/hooks/useAuth";

const navigation = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Users",
    icon: Users,
    path: "/users",
    roles: ["Admin"],
  },
  {
    title: "Employees",
    icon: UserRound,
    path: "/employees",
  },
  {
    title: "Attendance",
    icon: ClipboardCheck,
    path: "/attendance",
  },
  {
    title: "Daily Activity",
    icon: ClipboardList,
    path: "/daily-activity",
  },
  {
    title: "Reports",
    icon: FileBarChart,
    path: "/reports",
  },
];

function DashboardLayout({ children }) {
  const { logout, user } = useAuth();
  const location = useLocation();

  const visibleNavigation = navigation.filter((item) => {
    if (!item.roles) {
        return true;
    }

    return item.roles.includes(user?.role);
    });

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>EmAgro</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {visibleNavigation.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={location.pathname === item.path}
                      render={<Link to={item.path} />}
                    >
                      <item.icon />
                      <span>{item.title}</span>
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
              <SidebarMenuButton onClick={logout}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <main className="flex min-h-svh flex-1 flex-col">
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="font-medium">
            EmAgro Salesforce Management
          </span>
        </header>

        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

export default DashboardLayout;