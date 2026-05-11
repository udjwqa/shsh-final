"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, PlusCircle, List, Settings, LogOut, MessageCircle, Menu, X, Building2, Headphones, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/listings/new", label: "New Listing", icon: PlusCircle },
  { href: "/listings", label: "All Listings", icon: List },
  { href: "/chat", label: "Live Chat", icon: MessageCircle },
  { href: "/banks", label: "Banks", icon: Building2 },
  { href: "/operator", label: "Operator", icon: Headphones },
  { href: "/operator/cards", label: "Credit Cards", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="h-14 bg-[#0F0F0F] flex items-center px-4 md:px-6 shrink-0 relative z-50">
        <span className="text-base font-bold text-white tracking-tight mr-6 md:mr-10">SHSH</span>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/listings/new" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-[#1A1A1A] text-white"
                    : "text-[#6B6B6B] hover:text-[#A8A29E]"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-medium text-[#6B6B6B] hover:text-[#A8A29E] transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>

        {/* Mobile hamburger */}
        <div className="flex-1 md:hidden" />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[#6B6B6B] hover:text-white transition-colors cursor-pointer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-[#0A0A0A]/95 z-40 backdrop-blur-sm">
          <nav className="flex flex-col p-4 gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/listings/new" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#1A1A1A] text-white"
                      : "text-[#6B6B6B] hover:text-[#A8A29E] hover:bg-[#141414]"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-[#6B6B6B] hover:text-red-400 hover:bg-[#141414] transition-colors cursor-pointer mt-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
