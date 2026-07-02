"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Plus, FileText, User } from "lucide-react";

export default function BottomNavigation() {
  const pathname = usePathname();

  const iconClass = (path: string) =>
    pathname === path ? "text-white" : "text-gray-300";

  return (
    <nav className="bg-[#476973] rounded-t-3xl py-5">
      <div className="flex justify-around">

        <Link href="/home">
          <House size={28} className={iconClass("/home")} />
        </Link>

        <Link href="/create-plan">
          <Plus size={28} className={iconClass("/create-plan")} />
        </Link>

        <Link href="/current-plan">
          <FileText size={28} className={iconClass("/current-plan")} />
        </Link>

        <Link href="/profile">
          <User size={28} className={iconClass("/profile")} />
        </Link>

      </div>
    </nav>
  );
}