import {
  Bookmark,
  LayoutDashboard,
  Search,
  Settings,
} from "lucide-react";

export const employerSidebarItems = [
  {
    label: "Dashboard",
    path: "/employer/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Students",
    path: "/employer/candidates",
    icon: Search,
  },
  {
    label: "Saved",
    path: "/employer/saved",
    icon: Bookmark,
  },
  {
    label: "Settings",
    path: "/employer/settings",
    icon: Settings,
  },
];
