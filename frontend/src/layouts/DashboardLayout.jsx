import {
  LayoutDashboard,
  Users,
  UserRound,
  ClipboardCheck,
  ClipboardList,
  ListTodo,
  FileBarChart,
  LogOut,
} from "lucide-react";

import {
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";

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
    roles: ["Sub Admin"],
  },
  {
    title: "Attendance",
    icon: ClipboardCheck,
    path: "/attendance",
    roles: ["Sub Admin"],
  },
  {
    title: "Tasks",
    icon: ListTodo,
    path: "/tasks",
    roles: ["Sub Admin"],
  },
  {
    title: "Employee Tasks",
    icon: ClipboardList,
    path: "/employee-tasks",
    roles: ["Sub Admin"],
  },
  {
    title: "Daily Activity",
    icon: ClipboardList,
    path: "/daily-activity",
    roles: ["Sub Admin"],
  },
  {
    title: "Reports",
    icon: FileBarChart,
    path: "/reports",
    roles: ["Sub Admin"],
  },
];


function DashboardLayout() {
  const { logout, user } = useAuth();
  const location = useLocation();


  const visibleNavigation = navigation.filter(
    (item) => {
      if (!item.roles) {
        return true;
      }

      return item.roles.includes(user?.role);
    }
  );


  return (
    <SidebarProvider>

      <Sidebar>

        <SidebarContent>

          <SidebarGroup>

            <SidebarGroupLabel>
              EmAgro
            </SidebarGroupLabel>


            <SidebarGroupContent>

              <SidebarMenu>

                {visibleNavigation.map(
                  (item) => (

                    <SidebarMenuItem
                      key={item.title}
                    >

                      <SidebarMenuButton
                        isActive={
                          location.pathname ===
                          item.path
                        }
                        render={
                          <Link
                            to={item.path}
                          />
                        }
                      >

                        <item.icon />

                        <span>
                          {item.title}
                        </span>

                      </SidebarMenuButton>

                    </SidebarMenuItem>

                  )
                )}

              </SidebarMenu>

            </SidebarGroupContent>

          </SidebarGroup>

        </SidebarContent>


        <SidebarFooter>

          <SidebarMenu>

            <SidebarMenuItem>

              <SidebarMenuButton
                onClick={logout}
              >

                <LogOut />

                <span>
                  Logout
                </span>

              </SidebarMenuButton>

            </SidebarMenuItem>

          </SidebarMenu>

        </SidebarFooter>

      </Sidebar>


      <main className="flex min-h-svh flex-1 flex-col">

        <header className="flex h-14 items-center gap-2 border-b px-4">

          <SidebarTrigger />

          <Separator
            orientation="vertical"
            className="mr-2 h-4"
          />

          <span className="font-medium">
            EmAgro Salesforce Management
          </span>

        </header>


        <div className="flex-1 p-6">
          <Outlet />
        </div>

      </main>

    </SidebarProvider>
  );
}


export default DashboardLayout;
