"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import {
  LayoutDashboard,
  Users,
  Wrench,
  ClipboardList,
  MessageCircle,
  LogOut,
  ChevronRight
} from "lucide-react";
import { signOut } from "next-auth/react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-amber-700",
  },
  {
    label: "Technicians",
    icon: Wrench,
    href: "/technicians",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/customers",
  },
  {
    label: "Service Requests",
    icon: ClipboardList,
    href: "/orders",
  },
  {
    label: "Chatbot",
    icon: MessageCircle,
    href: "/chatbot",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-black text-white border-r border-slate-800 w-64">
      <div className="px-6 py-2">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-bold">
            Pro<span className="text-amber-600">Fix</span>
          </h1>
        </Link>
      </div>

      <div className="flex-1 px-3">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition-all mb-1",
              pathname === route.href ? "bg-white/10 text-amber-500" : "text-zinc-400"
            )}
          >
            <div className="flex items-center flex-1">
              <route.icon className={cn("h-5 w-5 mr-3", pathname === route.href ? "text-amber-500" : "text-zinc-400")} />
              {route.label}
            </div>
            {pathname === route.href && <ChevronRight className="h-4 w-4" />}
          </Link>
        ))}
      </div>

      {/* Logout Button */}
      <div className="px-3 pb-4">
        <button
          onClick={() => signOut()}
          className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded-lg transition-all"
        >
          <div className="flex items-center flex-1">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </div>
        </button>
      </div>
    </div>
  );
}