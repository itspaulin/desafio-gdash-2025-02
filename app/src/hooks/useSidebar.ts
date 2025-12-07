import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { LayoutDashboard, BarChart3, Users } from "lucide-react";

export function useSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigation = [
    {
      name: "Dashboard Simples",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Dashboard Avançado",
      href: "/advanced",
      icon: BarChart3,
    },
    {
      name: "Usuários",
      href: "/users",
      icon: Users,
      adminOnly: true,
    },
  ];

  const filteredNavigation = navigation.filter(
    (item) => !item.adminOnly || user?.role === "admin"
  );

  return {
    user,
    sidebarOpen,
    setSidebarOpen,
    navigation: filteredNavigation,
    handleLogout,
  };
}
