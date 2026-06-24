import {
  ArrowLeft,
  LayoutDashboard,
  UserRound,
  FolderKanban,
  MessageSquare,
  Link2,
  Settings,
} from "lucide-react";

export const sidebarItems = [
  {
    label: "Portfolio",
    path: "/portfolio",
    icon: ArrowLeft,
  },
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: UserRound,
  },
  {
    label: "Projects",
    path: "/project",
    icon: FolderKanban,
  },
  {
    label: "Feedback",
    path: "/feedback",
    icon: MessageSquare,
  },
  {
    label: "Shareable link",
    path: "/share",
    icon: Link2,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];
