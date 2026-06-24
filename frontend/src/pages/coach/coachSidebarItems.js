import {
  LayoutDashboard,
  FolderKanban,
  MessageSquareText,
  Settings,
  UsersRound,
} from "lucide-react";

export const coachSidebarItems = [
  {
    label: "Dashboard",
    path: "/coach/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Students",
    path: "/coach/students",
    icon: UsersRound,
  },
  {
    label: "Projects",
    path: "/coach/projects",
    icon: FolderKanban,
  },
  {
    label: "Feedback",
    path: "/coach/feedback",
    icon: MessageSquareText,
  },
  {
    label: "Settings",
    path: "/coach/settings",
    icon: Settings,
  },
];
