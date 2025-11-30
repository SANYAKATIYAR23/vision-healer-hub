import { Home, Users, Calendar, FileText, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/doctor/dashboard", icon: Home },
  { title: "Patients", url: "/doctor/patients", icon: Users },
  { title: "Appointments", url: "/doctor/appointments", icon: Calendar },
  { title: "Reports", url: "/doctor/reports", icon: FileText },
];

export const DoctorSidebar = () => {
  const { state } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate('/');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            {state === "collapsed" ? "EC" : "EyeCare AI"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-muted"
                      activeClassName="bg-secondary/10 text-secondary font-semibold"
                    >
                      <item.icon className="w-5 h-5" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            {state !== "collapsed" && <span>Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
