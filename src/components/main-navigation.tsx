"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "./icons";

type MainNavigationProps = {
  variant?: "desktop" | "mobile";
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNavigation({ variant = "desktop" }: MainNavigationProps) {
  const pathname = usePathname();

  if (variant === "mobile") {
    return (
      <nav className="flex gap-2 overflow-x-auto px-4 pb-3">
        {mainNav.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs transition " +
                (active
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700")
              }
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="space-y-2 px-4 py-5">
      {mainNav.map((item, index) => {
        const active = isActivePath(pathname, item.href);
        const label = item.href === "/" ? item.label : `${index}. ${item.label}`;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              "flex h-12 items-center gap-3 rounded-lg px-4 text-sm font-medium transition " +
              (active
                ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
                : "text-slate-700 hover:bg-slate-50 hover:text-indigo-700")
            }
          >
            <span
              className={
                "grid h-7 w-7 place-items-center rounded-md " +
                (active ? "bg-indigo-600 text-white" : "bg-white text-slate-500")
              }
            >
              <item.icon className="h-4 w-4" />
            </span>
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
