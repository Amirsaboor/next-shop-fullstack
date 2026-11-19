"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

const menuItems = [
  { label: "داشبورد", href: "/admin", icon: "grid" },
  { label: "محصولات", href: "/admin/products", icon: "box", soon: true },
  { label: "دسته‌بندی‌ها", href: "/admin/categories", icon: "layers", soon: true },
  { label: "سفارش‌ها", href: "/admin/orders", icon: "receipt", soon: true },
  { label: "کاربران", href: "/admin/users", icon: "users", soon: true },
];

function MenuIcon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "box":
      return <svg viewBox="0 0 24 24" {...common}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 8 9 5 9-5M3 8v9l9 5 9-5V8M12 13v9" /></svg>;
    case "layers":
      return <svg viewBox="0 0 24 24" {...common}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></svg>;
    case "receipt":
      return <svg viewBox="0 0 24 24" {...common}><path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Z" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>;
    case "users":
      return <svg viewBox="0 0 24 24" {...common}><circle cx="9" cy="8" r="3" /><path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v1" /></svg>;
    default:
      return <svg viewBox="0 0 24 24" {...common}><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="5" rx="2" /><rect x="13" y="10" width="8" height="11" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /></svg>;
  }
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#121417]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="بستن منو"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex flex-col border-l border-white/10 bg-[#121417] text-white transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"} ${collapsed ? "w-[82px]" : "w-[260px]"}`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-5">
          {(!collapsed || sidebarOpen) && (
            <Link href="/admin" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff5a1f] text-lg font-black">S</span>
              <span>
                <span className="block text-sm font-bold">Saboor Shop</span>
                <span className="mt-0.5 block text-[11px] text-white/45">مدیریت فروشگاه</span>
              </span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white lg:flex"
            aria-label="جمع کردن منو"
          >
            <span className="text-xl">{collapsed ? "‹" : "›"}</span>
          </button>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 lg:hidden"
            aria-label="بستن منو"
          >
            ×
          </button>
        </div>

        <div className="px-4 pt-7">
          {(!collapsed || sidebarOpen) && (
            <p className="mb-3 px-3 text-[10px] font-semibold tracking-wider text-white/35">مدیریت</p>
          )}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const active = pathname === item.href;
              const content = (
                <>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? "bg-[#ff5a1f] text-white" : "text-white/60"}`}>
                    <span className="h-[18px] w-[18px]"><MenuIcon name={item.icon} /></span>
                  </span>
                  {(!collapsed || sidebarOpen) && (
                    <>
                      <span className="flex-1 text-right">{item.label}</span>
                      {item.soon && <span className="rounded-md bg-white/10 px-2 py-1 text-[9px] text-white/45">به‌زودی</span>}
                    </>
                  )}
                </>
              );

              return (
                <div key={item.href}>
                  {item.soon ? (
                    <div title="این بخش در مرحله بعد ساخته می‌شود" className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-white/35">
                      {content}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition ${active ? "bg-white/10 font-semibold text-white" : "text-white/65 hover:bg-white/[0.06] hover:text-white"}`}
                    >
                      {content}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className={`rounded-xl border border-white/10 bg-white/[0.04] p-3 ${collapsed ? "text-center" : ""}`}>
            {(!collapsed || sidebarOpen) ? (
              <>
                <p className="text-xs font-semibold">پنل مدیریت</p>
                <p className="mt-1 text-[11px] leading-5 text-white/45">بخش‌های فروشگاه به‌تدریج به این پنل متصل می‌شوند.</p>
              </>
            ) : <span className="text-xs text-white/50">پنل</span>}
          </div>
        </div>
      </aside>

      <div className={`min-h-screen transition-all duration-300 ${collapsed ? "lg:mr-[82px]" : "lg:mr-[260px]"}`}>
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-black/5 bg-white/85 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 text-xl text-[#34383f] lg:hidden"
              aria-label="باز کردن منو"
            >
              ☰
            </button>
            <div>
              <p className="text-sm font-bold">پنل مدیریت</p>
              <p className="mt-1 text-[11px] text-[#8b9099]">مدیریت و نظارت بر فروشگاه</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-[#777d86] sm:block">مدیر فروشگاه</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#121417] text-sm font-bold text-white">م</span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] p-4 sm:p-7">{children}</main>
      </div>
    </div>
  );
}
