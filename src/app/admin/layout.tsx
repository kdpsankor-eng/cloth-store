"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Settings,
  LogOut,
  ExternalLink,
  Store,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, don't show admin sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const navLinks = [
    { label: "ড্যাশবোর্ড", href: "/admin", icon: LayoutDashboard },
    { label: "অর্ডার সমূহ", href: "/admin/orders", icon: ShoppingBag },
    { label: "প্রোডাক্ট ও স্টক", href: "/admin/products", icon: Package },
    { label: "ডেলিভারি ও সেটিংস", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8F9FA]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0 hidden md:flex">
        {/* Brand */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#762A43] text-white flex items-center justify-center font-serif text-lg font-bold">
            অ
          </div>
          <div>
            <span className="text-base font-bold font-serif text-[#252525] block">
              অরণ্যা ফ্যাশন
            </span>
            <span className="text-[10px] text-[#C5A46D] uppercase font-bold tracking-wider">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#762A43] text-white shadow-xs"
                    : "text-gray-600 hover:bg-[#F7F0E8]/50 hover:text-[#762A43]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            <span className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#762A43]" />
              <span>ওয়েবসাইট দেখুন</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="md:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <span className="font-serif font-bold text-base text-[#762A43]">অরণ্যা অ্যাডমিন</span>
          <div className="flex items-center gap-3 text-xs font-medium">
            <Link href="/admin/orders" className="text-[#762A43]">অর্ডার</Link>
            <Link href="/admin/settings" className="text-gray-600">সেটিংস</Link>
            <button onClick={handleLogout} className="text-red-500">লগআউট</button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
